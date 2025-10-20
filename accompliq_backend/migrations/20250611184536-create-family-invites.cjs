"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("family_invites", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
      },
      inviter_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      subscription_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("pending", "accepted", "declined"),
        defaultValue: "pending",
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("family_invites");
  },
};
