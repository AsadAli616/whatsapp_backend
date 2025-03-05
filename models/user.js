"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Chat, {
        foreignKey: "personOneId",
      });
      User.hasMany(models.Chat, {
        foreignKey: "personTwoId",
      });
    }
  }
  User.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      code: DataTypes.STRING,
      verify: DataTypes.BOOLEAN,
      Pic: DataTypes.BOOLEAN,
      socketId: DataTypes.STRING,
      fcmToken: DataTypes.STRING,
      whatappstatus: {
        allowNull: true,
        type: DataTypes.STRING,
        defaultValue: "Hey there! I am using WhatsApp",
      },
      status: {
        allowNull: true,
        type: DataTypes.STRING,
        defaultValue: "offline",
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
