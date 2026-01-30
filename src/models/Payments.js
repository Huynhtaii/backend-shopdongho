"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      // Liên kết với Order
      Payment.belongsTo(models.Order, { foreignKey: "order_id" });
    }
  }
  Payment.init(
    {
      payment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      payment_date: DataTypes.DATE,
      amount: DataTypes.DECIMAL(10, 2),
      payment_method: DataTypes.ENUM(
        "Credit Card",
        "PayPal",
        "COD",
        "Bank Transfer"
      ),
      status: DataTypes.ENUM("Success", "Failed", "Pending"),
      order_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Payment",
      tableName: "payments",
      timestamps: false,
    }
  );
  return Payment;
};
