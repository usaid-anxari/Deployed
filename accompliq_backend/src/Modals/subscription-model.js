import { DataTypes } from "sequelize";
import { sequelize } from "../db/config.js";

const Subscription = sequelize.define(
  "Subscription",
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
    stripe_subscription_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    priceId: {
      type: DataTypes.STRING,
    },
    last_plan_change_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_plan_change_at: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
    },
    current_period_start: {
      type: DataTypes.DATE,
    },
    familyPlan: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "family_plan",
    },
    invitedMembers: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      defaultValue: [],
    },
    current_period_end: {
      type: DataTypes.DATE,
    },
    cancel_at_period_end: {
      type: DataTypes.BOOLEAN,
    },
    cancel_at: {
      type: DataTypes.DATE,
    },
    created: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "subscriptions",
    underscored: true,
    timestamp: true,
  }
);

export default Subscription;
