'use strict';

module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.changeColumn('feedbacks', 'image', {
         type: Sequelize.TEXT,
         allowNull: true,
      });
   },

   down: async (queryInterface, Sequelize) => {
      await queryInterface.changeColumn('feedbacks', 'image', {
         type: Sequelize.STRING,
         allowNull: true,
      });
   },
};
