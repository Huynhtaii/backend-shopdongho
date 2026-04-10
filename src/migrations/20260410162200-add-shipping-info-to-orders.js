'use strict';

module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn('orders', 'shipping_name', {
         type: Sequelize.STRING,
         allowNull: true,
      });
      await queryInterface.addColumn('orders', 'shipping_phone', {
         type: Sequelize.STRING,
         allowNull: true,
      });
      await queryInterface.addColumn('orders', 'shipping_email', {
         type: Sequelize.STRING,
         allowNull: true,
      });
      await queryInterface.addColumn('orders', 'shipping_address', {
         type: Sequelize.TEXT,
         allowNull: true,
      });
   },

   down: async (queryInterface, Sequelize) => {
      await queryInterface.removeColumn('orders', 'shipping_name');
      await queryInterface.removeColumn('orders', 'shipping_phone');
      await queryInterface.removeColumn('orders', 'shipping_email');
      await queryInterface.removeColumn('orders', 'shipping_address');
   },
};
