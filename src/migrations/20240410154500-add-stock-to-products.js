'use strict';

module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn('products', 'stock', {
         type: Sequelize.INTEGER,
         allowNull: false,
         defaultValue: 20,
         after: 'price', // Placing it after price for logical order
      });
   },

   down: async (queryInterface, Sequelize) => {
      await queryInterface.removeColumn('products', 'stock');
   },
};
