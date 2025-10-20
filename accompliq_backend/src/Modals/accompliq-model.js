import { DataTypes } from "sequelize";
import { sequelize } from "../db/config.js";

const Accompliq = sequelize.define(
  "Accompliq",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
    personalInfo: {
      type: DataTypes.JSONB,
      allowNull: false,
      field: "personal_info",
    },
    familyInfo: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      field: "family_info",
    },
    educationCareer: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      field: "education_career",
    },
    personalLife: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      field: "personal_life",
    },
    legacyTribute: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      field: "legacy_tribute",
    },
    funeralDetail: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      field: "funeral_detail",
    },
    selectedTemplate: {
      type: DataTypes.ENUM(
        "classic",
        "modern",
        "elegant",
        "simple",
        "religious"
      ),
      defaultValue: "classic",
      field: "selected_template",
    },
    media: {
      type: DataTypes.JSONB,
      defaultValue: { images: [], videos: [] },
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_public",
    },
    language: {
      type: DataTypes.STRING,
      defaultValue: "en",
    },
  },
  {
    tableName: "accompliqs",
    timestamps: true,
    underscored: true,
    hooks: {
      beforeValidate: (accompliq) => {
        const jsonFields = [
          "familyInfo",
          "educationCareer",
          "personalLife",
          "legacyTribute",
          "funeralDetail",
        ];
        jsonFields.forEach((field) => {
          if (!accompliq[field]) accompliq[field] = {};
        });
      },
    },
  }
);

// Keep your class methods
Accompliq.prototype.getFullName = function () {
  return this.personalInfo.fullName;
};

Accompliq.prototype.getLifeDates = function () {
  return `${this.personalInfo.dateOfBirth} - ${this.personalInfo.dateOfPassing}`;
};

export default Accompliq;
