"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Chats", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      personOneId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
          as: "personOneId",
        },
      },
      personTwoId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
          as: "personTwoId",
        },
      },
      blocked: {
        type: Sequelize.BOOLEAN,
      },
      messageId: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Chats");
  },
};
