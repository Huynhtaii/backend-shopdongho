"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Liên kết với Order (1-n)
      User.hasMany(models.Order, { foreignKey: "user_id" });
      // Liên kết với Cart (1-1)
      User.hasOne(models.Cart, { foreignKey: "user_id" });
      // Liên kết với Feedback (1-n)
      User.hasMany(models.Feedback, { foreignKey: "user_id" });
      // Liên kết với Role (1-1)
      User.belongsTo(models.Role, { foreignKey: "role_id" });
    }
  }
  User.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING(100),
      email: DataTypes.STRING(100),
      password: DataTypes.STRING(255),
      phone: DataTypes.STRING(15),
      address: DataTypes.TEXT,
      created_at: DataTypes.DATE,
      role_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: false,
    }
  );
  return User;
};
