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
      Chat.belongsTo(models.User, {
        foreignKey: "personOneId",
      });
      Chat.belongsTo(models.User, {
        foreignKey: "personTwoId",
      });
      Chat.hasMany(models.Message, {
        foreignKey: "chatId",
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
      },
      blocked: DataTypes.BOOLEAN,
      messageId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Chat",
    }
  );
  return Chat;
};
