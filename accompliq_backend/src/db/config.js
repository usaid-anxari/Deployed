import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.POSTGRES_DB,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT || 5432,
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    dialectOptions: {
      ssl: process.env.NODE_ENV === "production" ? {
        require: true,
        rejectUnauthorized: false
      } : false,
    },
    define: {
      timestamps: true,
      underscored: true,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    // Only sync in development
    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ force: true });
      console.log("✅ Database synced");
    } else if (process.env.SYNC_DB_ON_STARTUP === "true") {
      await sequelize.sync();
      console.log("✅ Database synced (production)");
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    // Don't exit in serverless environment, let the function handle the error
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
    throw error;
  }
};

export { sequelize, connectDB };
