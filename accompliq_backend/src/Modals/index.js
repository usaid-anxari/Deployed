import User from "./user-model.js";
import Accompliq from "./accompliq-model.js";
import AIDraft from "./aiDraft-model.js";
import BucketList from "./bucket-model.js";
import PaymentMethod from "./payment-method-model.js";
import Subscription from "./subscription-model.js";
import Invoice from "./invoice-model.js";
import Payment from "./payment-model.js";
import FamilyInvite from "./family-invite-model.js";

// Set up relationships
function setupRelationships() {
  // ----- Existing relationships -----
  User.hasMany(Accompliq, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
  });

  Accompliq.belongsTo(User, {
    foreignKey: "user_id",
  });

  User.hasMany(AIDraft, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
  });

  AIDraft.belongsTo(User, {
    foreignKey: "user_id",
  });

  Accompliq.hasMany(AIDraft, {
    foreignKey: "accompliq_id",
    onDelete: "CASCADE",
  });

  AIDraft.belongsTo(Accompliq, {
    foreignKey: "accompliq_id",
  });

  User.hasMany(BucketList, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
  });

  BucketList.belongsTo(User, {
    foreignKey: "user_id",
  });

  // ----- Stripe/Billing relationships -----
  User.hasMany(PaymentMethod, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
  });
  PaymentMethod.belongsTo(User, {
    foreignKey: "user_id",
  });

  User.hasMany(Subscription, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
  });
  Subscription.belongsTo(User, {
    foreignKey: "user_id",
  });

  User.hasMany(Invoice, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
  });
  Invoice.belongsTo(User, {
    foreignKey: "user_id",
  });

  User.hasMany(Payment, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
  });
  Payment.belongsTo(User, {
    foreignKey: "user_id",
  });

  // (Optional) Relationships between Payment, Invoice, Subscription, PaymentMethod if needed:
  // For example, you might want:
  Payment.belongsTo(Invoice, { foreignKey: "invoice_id", allowNull: true });
  Invoice.hasMany(Payment, { foreignKey: "invoice_id" });

  Payment.belongsTo(Subscription, {
    foreignKey: "subscription_id",
    allowNull: true,
  });
  Subscription.hasMany(Payment, { foreignKey: "subscription_id" });

  Payment.belongsTo(PaymentMethod, {
    foreignKey: "payment_method_id",
    allowNull: true,
  });
  PaymentMethod.hasMany(Payment, { foreignKey: "payment_method_id" });

  Subscription.belongsTo(PaymentMethod, {
    foreignKey: "default_payment_method_id",
    allowNull: true,
  });
  PaymentMethod.hasMany(Subscription, {
    foreignKey: "default_payment_method_id",
  });

  // These optional associations are for more advanced billing queries (history, etc).
}

export {
  setupRelationships,
  User,
  Accompliq,
  AIDraft,
  BucketList,
  PaymentMethod,
  Subscription,
  Invoice,
  Payment,
  FamilyInvite,
};
