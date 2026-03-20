'use strict';

module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn('products', 'status', {
         type: Sequelize.TINYINT,
         allowNull: false,
         defaultValue: 1, // 1: Active, 0: Hidden
         after: 'name',
      });
      await queryInterface.addColumn('categories', 'status', {
         type: Sequelize.TINYINT,
         allowNull: false,
         defaultValue: 1,
         after: 'name',
      });
      await queryInterface.addColumn('brands', 'status', {
         type: Sequelize.TINYINT,
         allowNull: false,
         defaultValue: 1,
         after: 'name',
      });
   },

   down: async (queryInterface, Sequelize) => {
      await queryInterface.removeColumn('products', 'status');
      await queryInterface.removeColumn('categories', 'status');
      await queryInterface.removeColumn('brands', 'status');
   },
};
