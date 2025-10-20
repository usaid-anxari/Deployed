import { Sequelize } from "sequelize";
import { sequelize } from "./config.js";
import {
  User,
  Accompliq,
  AIDraft,
  Subscription,
  PaymentMethod,
  Payment,
  Invoice,
  BucketList,
  FamilyInvite,
} from "../Modals/index.js";
import { setupRelationships } from "../Modals/relationships.js";

export const syncDatabase = async () => {
  // Enhanced production check with more options
  if (process.env.NODE_ENV === "production") {
    if (process.env.SYNC_DB_ON_STARTUP === "force") {
      console.log("⚠️ FORCE SYNC enabled - this will DROP ALL TABLES!");
    } else if (process.env.SYNC_DB_ON_STARTUP !== "true") {
      console.log(
        "ℹ️ Skipping sync in production (SYNC_DB_ON_STARTUP not enabled)"
      );
      return;
    }
  }

  // Only create transaction in production (not needed for sync operations)
  const transaction =
    process.env.NODE_ENV === "production"
      ? await sequelize.transaction({
          isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
        })
      : null;

  try {
    // Verify connection first
    await sequelize.authenticate();
    console.log("✔️ Database connection verified");

    // Setup all model relationships
    setupRelationships();

    // Define sync order with dependency information
    const syncOrder = [
      {
        name: "User",
        model: User,
        options: getSyncOptions("users"),
      },
      {
        name: "PaymentMethod",
        model: PaymentMethod,
        options: getSyncOptions("payment_methods"),
      },
      {
        name: "Subscription",
        model: Subscription,
        options: getSyncOptions("subscriptions"),
      },
      {
        name: "Invoice",
        model: Invoice,
        options: getSyncOptions("invoices"),
      },
      {
        name: "Payment",
        model: Payment,
        options: getSyncOptions("payments"),
      },
      {
        name: "Accompliq",
        model: Accompliq,
        options: getSyncOptions("accompliqs"),
      },
      {
        name: "AIDraft",
        model: AIDraft,
        options: getSyncOptions("ai_drafts"),
      },
      {
        name: "BucketList",
        model: BucketList,
        options: getSyncOptions("bucket_lists"),
      },
      {
        name: "FamilyInvite",
        model: FamilyInvite,
        options: getSyncOptions("family_invites"),
      },
    ];

    // Execute sync in order
    for (const { name, model, options } of syncOrder) {
      try {
        await model.sync({ ...options });
        console.log(`✅ Synced ${name} table`);
      } catch (syncError) {
        console.error(`❌ Failed to sync ${name} table`);
        throw syncError;
      }
    }

    if (transaction) await transaction.commit();
    console.log("\n🎉 Database sync completed successfully!\n");
  } catch (error) {
    console.error("\n💥 Database sync failed!\n");

    // Enhanced error logging
    console.error("Error details:");
    console.error("- Message:", error.message);

    if (error.errors) {
      console.error("- Validation errors:");
      error.errors.forEach((err) => console.error(`  • ${err.message}`));
    }

    if (error.original) {
      console.error("- Database error:", error.original.message);
    }

    // Specific troubleshooting for common issues
    if (error.message.includes('relation "users" does not exist')) {
      console.log(
        "\n💡 Solution: Try running with INITIAL_SETUP=true to create missing tables"
      );
    }

    if (transaction) {
      try {
        await transaction.rollback();
        console.log("🔙 Transaction rolled back");
      } catch (rollbackError) {
        console.error(
          "❌ Failed to rollback transaction:",
          rollbackError.message
        );
      }
    }

    process.exit(1);
  }
};

// Improved sync options with production safety
function getSyncOptions(tableName) {
  if (process.env.SYNC_DB_ON_STARTUP === "force") {
    return { force: true };
  }

  if (process.env.NODE_ENV === "production") {
    if (process.env.INITIAL_SETUP === "true") {
      // Initial setup - create tables without altering
      return { force: false, alter: false };
    }
    // Safe production alter - only adds new columns
    return { alter: { add: true, drop: false } };
  }

  // Development defaults
  return { alter: true };
}

// At the very bottom of db/sync.js (ESM-friendly)
if (import.meta.url === `file://${process.argv[1]}`) {
  syncDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
