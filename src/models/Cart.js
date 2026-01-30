"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      // Liên kết với User
      Cart.belongsTo(models.User, { foreignKey: "user_id" });
      // Liên kết với CartItem
      Cart.hasMany(models.CartItem, { foreignKey: "cart_id" });
    }
  }
  Cart.init(
    {
      cart_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Cart",
      tableName: "cart",
      timestamps: false,
    }
  );
  return Cart;
};
