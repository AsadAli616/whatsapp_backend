"use strict";

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require("bcrypt");
module.exports = {
  async up(queryInterface, Sequelize) {
    const saltRounds = 10;
    const pasword1 = "asad";
    const pasword = await bcrypt.hash(pasword1, saltRounds);
    return queryInterface.bulkInsert("Users", [
      {
        firstName: "John",
        lastName: "chu",
        email: "example@example.com",
        code: "S409",
        verify: true,
        password: pasword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: "John",
        lastName: "chu",
        email: "example2@example.com",
        code: "S409",
        verify: true,
        password: pasword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: "John",
        lastName: "chu",
        email: "example3@example.com",
        code: "S409",
        verify: true,
        password: pasword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: "John",
        lastName: "chu",
        email: "example4@example.com",
        code: "S409",
        verify: true,
        password: pasword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
