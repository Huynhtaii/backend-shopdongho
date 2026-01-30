"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    static associate(models) {
      // Liên kết với Order
      OrderItem.belongsTo(models.Order, { foreignKey: "order_id" });
      // Liên kết với Product
      OrderItem.belongsTo(models.Product, { foreignKey: "product_id" });
    }
  }
  OrderItem.init(
    {
      order_item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      quantity: DataTypes.INTEGER,
      price: DataTypes.DECIMAL(10, 2),
      order_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "OrderItem",
      tableName: "order_items",
      timestamps: false,
    }
  );
  return OrderItem;
};
