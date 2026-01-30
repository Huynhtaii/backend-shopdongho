"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      // Liên kết với User
      Order.belongsTo(models.User, { foreignKey: "user_id" });
      // Liên kết với OrderItem
      Order.hasMany(models.OrderItem, {
        foreignKey: "order_id",
        as: 'order_items'
      });
      // Liên kết với Payment
      Order.hasOne(models.Payment, { foreignKey: "order_id" });
      // Liên kết với Feedback
      Order.hasMany(models.Feedback, { foreignKey: "order_id" });
    }
  }
  Order.init(
    {
      order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      order_date: DataTypes.DATE,
      status: DataTypes.ENUM("Pending", "Shipped", "Completed", "Canceled"),
      total_amount: DataTypes.DECIMAL(10, 2),
      user_id: DataTypes.INTEGER,
      discount_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "orders",
      timestamps: false,
    }
  );
  return Order;
};
