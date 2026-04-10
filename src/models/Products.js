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
         // Liên kết với Brand (n-1)
         Product.belongsTo(models.Brand, { foreignKey: 'brand_id', as: 'brand' });
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
         status: {
            type: DataTypes.TINYINT,
            defaultValue: 1, // 1: Active, 0: Hidden
         },
         description: DataTypes.TEXT,
         price: DataTypes.DECIMAL(10, 2),
         discount_price: DataTypes.DECIMAL(10, 2),
         rating: DataTypes.INTEGER,
         review_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
         },
         created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
         },
         brand_id: DataTypes.INTEGER,
         sku: DataTypes.STRING(20),
         origin: DataTypes.STRING(100),
         target_audience: DataTypes.STRING(100),
         product_line: DataTypes.STRING(100),
         water_resistance: DataTypes.STRING(50),
         movement_type: DataTypes.STRING(100),
         glass_material: DataTypes.STRING(100),
         strap_material: DataTypes.STRING(100),
         case_size: DataTypes.STRING(50),
         case_thickness: DataTypes.STRING(50),
         utilities: DataTypes.TEXT,
         stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 20,
         },
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
