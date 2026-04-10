'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class ShippingAddress extends Model {
      static associate(models) {
         // Link with User
         ShippingAddress.belongsTo(models.User, { foreignKey: 'user_id' });
      }
   }
   ShippingAddress.init(
      {
         id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
         },
         user_id: DataTypes.INTEGER,
         recipient_name: DataTypes.STRING,
         recipient_phone: DataTypes.STRING,
         recipient_email: DataTypes.STRING,
         address: DataTypes.TEXT,
         is_default: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
         },
      },
      {
         sequelize,
         modelName: 'ShippingAddress',
         tableName: 'shipping_addresses',
         timestamps: true,
      },
   );
   return ShippingAddress;
};
