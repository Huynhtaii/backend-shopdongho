"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CategoriesHasProducts extends Model {
    static associate(models) {
      // Quan hệ đã được định nghĩa ở Product và Category, bảng này chủ yếu để làm bảng trung gian
    }
  }
  CategoriesHasProducts.init(
    {
      categories_category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      products_product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: "CategoriesHasProducts",
      tableName: "categories_has_products",
      timestamps: false,
    }
  );
  return CategoriesHasProducts;
};
