// src/Models/FamilyInvite.js
import { DataTypes } from "sequelize";
import { sequelize } from "../db/config.js";

const FamilyInvite = sequelize.define(
  "FamilyInvite",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    inviterId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "inviter_id",
    },
    subscriptionId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "subscription_id",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "declined"),
      defaultValue: "pending",
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      // field is 'token', not 'invite_token'
    },
    createdAt: {
      type: DataTypes.DATE,
      field: "created_at",
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: "updated_at",
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "family_invites",
    underscored: true,
    timestamps: true,
  }
);

export default FamilyInvite;
