import { DataTypes } from "sequelize";
import { sequelize } from "../db/config.js";

const BucketList = sequelize.define(
  "bucket_lists",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "user_id",
      references: {
        model: "users",
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Title is required" },
      },
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imageKey: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    underscored: true,
  }
);

export default BucketList;
