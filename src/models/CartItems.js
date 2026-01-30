"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    static associate(models) {
      // Liên kết với Cart
      CartItem.belongsTo(models.Cart, { foreignKey: "cart_id" });
      // Liên kết với Product
      CartItem.belongsTo(models.Product, { foreignKey: "product_id" });
    }
  }
  CartItem.init(
    {
      cart_item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      quantity: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
      cart_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "CartItem",
      tableName: "cart_items",
      timestamps: false,
    }
  );
  return CartItem;
};
