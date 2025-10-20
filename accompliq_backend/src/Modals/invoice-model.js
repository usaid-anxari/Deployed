import { DataTypes } from "sequelize";
import { sequelize } from "../db/config.js";

const Invoice = sequelize.define(
  "Invoice",
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
    stripe_invoice_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    amount_due: {
      type: DataTypes.INTEGER,
    },
    amount_paid: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.STRING,
    },
    hosted_invoice_url: {
      type: DataTypes.STRING,
    },
    created: {
      type: DataTypes.DATE,
    },
    paidAt: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "invoices",
    underscored: true,
    timestamps: true,
  }
);

export default Invoice;
