import { DataTypes } from "sequelize";
import { sequelize } from "../db/config.js";

const User = sequelize.define(
  "User",
  {
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    stripe_customer_id: { type: DataTypes.STRING },
  },
  {
    tableName: "users",
    underscored: true,
    timestamps: true,
    createdAt: "create_at",
    updatedAt: false,
  }
);

export default User;
