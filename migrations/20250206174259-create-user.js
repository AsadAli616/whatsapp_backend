"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      firstName: {
        type: Sequelize.STRING,
      },
      lastName: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      Pic: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      code: {
        type: Sequelize.STRING,
      },
      verify: {
        allowNull: true,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      socketId: {
        allowNull: true,
        // defaultValue: "",
        type: Sequelize.STRING,
      },
      fcmToken: {
        allowNull: true,
        // defaultValue: "",
        type: Sequelize.STRING,
      },
      whatappstatus: {
        allowNull: true,
        defaultValue: "Hey there! I am using WhatsApp",
        type: Sequelize.STRING,
      },

      status: {
        allowNull: true,
        defaultValue: "offline",
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("Users");
  },
};
