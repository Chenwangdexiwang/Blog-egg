"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    const { INTEGER, STRING, DATE } = Sequelize;
    await queryInterface.createTable(
      "users",
      {
        id: {
          type: INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        username: STRING(28),
        avatar: STRING(128),
        password: STRING(248),
        email: STRING,
        level: {
          type: INTEGER,
          defaultValue: 1
        },
        created_at: DATE
      },
      {
        tableName: "users",
        freezeTableName: true,
        charset: "utf8",
        collate: "utf8_general_ci"
      }
    );
  },

  down: async queryInterface => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("users");
  }
};
