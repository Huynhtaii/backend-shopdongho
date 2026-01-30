'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class Product extends Model {
      static associate(models) {
         // Liên kết với Category qua bảng trung gian (n-n)
         Product.belongsToMany(models.Category, {
            through: 'categories_has_products',
            foreignKey: 'products_product_id',
            timestamps: false,
         });
         // Liên kết với ProductImage (1-n)
         Product.hasMany(models.ProductImage, { foreignKey: 'product_id' });
         // Liên kết với OrderItem (1-n)
         Product.hasMany(models.OrderItem, { foreignKey: 'product_id' });
         // Liên kết với CartItem (1-n)
         Product.hasMany(models.CartItem, { foreignKey: 'product_id' });
         // Liên kết với Feedback (1-n)
         Product.hasMany(models.Feedback, { foreignKey: 'product_id' });
      }
   }
   Product.init(
      {
         product_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
         },
         name: DataTypes.STRING(150),
         description: DataTypes.TEXT,
         price: DataTypes.DECIMAL(10, 2),
         discount_price: DataTypes.DECIMAL(10, 2),
         rating: DataTypes.INTEGER, // Có thể chuyển thành DECIMAL nếu cần chính xác
         created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
         },
         brand_id: DataTypes.INTEGER,
         sku: DataTypes.STRING(20),
      },
      {
         sequelize,
         modelName: 'Product',
         tableName: 'products',
         timestamps: false,
      },
   );
   return Product;
};
