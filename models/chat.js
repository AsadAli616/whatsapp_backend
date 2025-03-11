"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Chat.hasMany(models.Message, {
        foreignKey: "chatId",
      });
      Chat.belongsTo(models.User, {
        foreignKey: "personOneId",
        as: "personOne",
      });
      Chat.belongsTo(models.User, {
        foreignKey: "personTwoId",
        as: "personTwo",
      });
    }
  }
  Chat.init(
    {
      personOneId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
          as: "personOneId",
        },
      },
      personTwoId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
          as: "personTwoId",
        },
        allowNull: true,
      },
      blockUserId: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      blocked: { type: DataTypes.BOOLEAN, defaultValue: false },
      messageId: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      sequelize,
      modelName: "Chat",
    }
  );
  return Chat;
};
