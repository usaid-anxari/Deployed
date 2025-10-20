import { DataTypes } from "sequelize";
import { sequelize } from "../db/config.js";

const AIDraft = sequelize.define(
  "AIDraft",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    accompliqId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "accompliqs",
        key: "id",
      },
      field: "accompliq_id",
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      field: "user_id",
    },
    draftContent: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "draft_content",
    },
    version: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    isSelected: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_selected",
    },
    promptUsed: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "prompt_used",
    },
    modelUsed: {
      type: DataTypes.STRING,
      defaultValue: "gpt-3.5-turbo",
      field: "model_used",
    },
    temperature: {
      type: DataTypes.FLOAT,
      defaultValue: 0.7,
    },
    accompliqDetails: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: "accompliq_details",
    },
  },
  {
    tableName: "ai_drafts",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ["accompliq_id"],
      },
      {
        fields: ["user_id"],
      },
      {
        fields: ["is_selected"],
      },
    ],
  }
);

// Class methods
AIDraft.prototype.markAsSelected = async function () {
  await AIDraft.update(
    { isSelected: false },
    {
      where: {
        accompliqId: this.accompliqId,
      },
    }
  );

  this.isSelected = true;
  await this.save();
  return this;
};

export default AIDraft;
