import { DataTypes } from "sequelize";
import { sequelize } from "../db/config.js";
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      lowercase: true,
      validate: { isEmail: true },
      field: "email",
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "full_name",
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM("male", "female", "other"),
      allowNull: true,
    },
    familyPlanSubscriptionId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "family_plan_subscription_id",
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    profileCompleted: {
      type: DataTypes.ENUM(
        "email",
        "password",
        "profile",
        "subscription",
        "completed"
      ),
      defaultValue: "email",
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    invitedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "SET NULL",
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Active",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "date_of_birth",
    },
    lastLogin: { type: DataTypes.DATE },
    lastLoginMethod: {
      type: DataTypes.ENUM("email", "google", "facebook"),
      defaultValue: "email",
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("admin", "user"),
      defaultValue: "user",
      allowNull: false,
    },
    stripeCustomerId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "stripe_customer_id",
    },
    stripeDefaultPaymentMethodId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "stripe_default_payment_method_id",
    },
    stripeSubscriptionId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "stripe_subscription_id",
    },
  },
  {
    timestamps: true,
    tableName: "users",
    underscored: true,
    indexes: [
      {
        fields: ["email"],
        unique: true,
      },
    ],
  }
);

export default User;
