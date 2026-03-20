'use strict';

module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn('feedbacks', 'image', {
         type: Sequelize.STRING,
         allowNull: true,
         after: 'comments',
      });
   },

   down: async (queryInterface, Sequelize) => {
      await queryInterface.removeColumn('feedbacks', 'image');
   },
};
