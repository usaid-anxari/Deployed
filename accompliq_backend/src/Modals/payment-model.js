import { DataTypes } from "sequelize";
import { sequelize } from "../db/config.js";

const Payment = sequelize.define(
  "Payment",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    stripe_payment_intent_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    amount: {
      type: DataTypes.INTEGER,
    },
    currency: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
    payment_method_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    created: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "payments",
    underscored: true,
    timestamps: true,
  }
);

export default Payment;
