"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Message.belongsTo(models.Chat, {
        foreignKey: "chatId",
      });
    }
  }
  Message.init(
    {
      chatId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Chats",
          key: "id",
          as: "chatId",
        },
      },
      type: {
        allowNull: true,
        type: DataTypes.STRING,
        defaultValue: "text",
      },
      message: DataTypes.STRING,
      personId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Message",
    }
  );
  return Message;
};
