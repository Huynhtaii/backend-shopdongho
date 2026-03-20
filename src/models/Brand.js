'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
   class Brand extends Model {
      static associate(models) {
         Brand.hasMany(models.Product, { foreignKey: 'brand_id', as: 'products' });
      }
   }
   Brand.init(
      {
         brand_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
         },
         name: {
            type: DataTypes.STRING(100),
            allowNull: false,
         },
         status: {
            type: DataTypes.TINYINT,
            defaultValue: 1, // 1: Active, 0: Hidden
         },
         description: {
            type: DataTypes.TEXT,
            allowNull: true,
         },
         logo_url: {
            type: DataTypes.STRING(500),
            allowNull: true,
         },
         country: {
            type: DataTypes.STRING(100),
            allowNull: true,
         },
         created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
         },
      },
      {
         sequelize,
         modelName: 'Brand',
         tableName: 'brands',
         timestamps: false,
      },
   );
   return Brand;
};
