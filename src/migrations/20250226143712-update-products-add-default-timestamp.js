module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.changeColumn('products', 'created_at', {
         type: Sequelize.DATE,
         allowNull: false,
         defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      });
   },

   down: async (queryInterface, Sequelize) => {
      await queryInterface.changeColumn('products', 'created_at', {
         type: Sequelize.DATE,
         allowNull: false,
      });
   },
};
