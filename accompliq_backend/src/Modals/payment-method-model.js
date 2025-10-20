import { DataTypes } from "sequelize";
import { sequelize } from "../db/config.js";

const PaymentMethod = sequelize.define(
  "PaymentMethod",
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
    stripe_payment_method_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    brand: {
      type: DataTypes.STRING,
    },
    last$: {
      type: DataTypes.STRING(4),
    },
    exp_month: {
      type: DataTypes.INTEGER,
    },
    exp_year: {
      type: DataTypes.INTEGER,
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "payment_methods",
    underscored: true,
    timestamps: true,
  }
);

export default PaymentMethod;
