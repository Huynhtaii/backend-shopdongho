"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Feedback extends Model {
    static associate(models) {
      // Liên kết với User
      Feedback.belongsTo(models.User, { foreignKey: "user_id" });
      // Liên kết với Product
      Feedback.belongsTo(models.Product, { foreignKey: "product_id" });
      // Liên kết với Order
      Feedback.belongsTo(models.Order, { foreignKey: "order_id" });
    }
  }
  Feedback.init(
    {
      feedback_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      rating: DataTypes.INTEGER,
      comments: DataTypes.TEXT,
      created_at: DataTypes.DATE,
      is_resolved: DataTypes.TINYINT,
      product_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      order_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Feedback",
      tableName: "feedbacks",
      timestamps: false,
    }
  );
  return Feedback;
};
