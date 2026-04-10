'use strict';

module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('shipping_addresses', {
         id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
         },
         user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
               model: 'users',
               key: 'user_id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
         },
         recipient_name: {
            type: Sequelize.STRING,
            allowNull: false,
         },
         recipient_phone: {
            type: Sequelize.STRING,
            allowNull: false,
         },
         recipient_email: {
            type: Sequelize.STRING,
            allowNull: true,
         },
         address: {
            type: Sequelize.TEXT,
            allowNull: false,
         },
         is_default: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
         },
         createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
         },
         updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
         },
      });
   },

   down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('shipping_addresses');
   },
};
