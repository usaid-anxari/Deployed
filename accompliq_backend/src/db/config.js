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
    logging: console.log,
    dialectOptions: {
      ssl: false,
    },
    define: {
      timestamps: true,
      underscored: true,
    },
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();

    // Force sync in development, safe sync in production
    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ force: true });
    } else if (process.env.SYNC_DB_ON_STARTUP === "true") {
      await sequelize.sync();
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.error("Full error:", error);
    process.exit(1);
  }
};

export { sequelize, connectDB };
