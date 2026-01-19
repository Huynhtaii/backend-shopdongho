"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      // Liên kết với Product thông qua bảng trung gian categories_has_products
      // (n-n)
      Category.belongsToMany(models.Product, {
        through: "categories_has_products",
        foreignKey: "categories_category_id",
        timestamps: false,
      });
    }
  }
  Category.init(
    {
      category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING(100),
      description: DataTypes.TEXT,
      image: DataTypes.STRING(255),
    },
    {
      sequelize,
      modelName: "Category",
      tableName: "categories",
      timestamps: false,
    }
  );
  return Category;
};
