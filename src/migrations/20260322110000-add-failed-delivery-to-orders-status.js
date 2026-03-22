"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("orders", "status", {
      type: Sequelize.ENUM("Pending", "Shipped", "Completed", "Canceled", "FailedDelivery"),
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("orders", "status", {
      type: Sequelize.ENUM("Pending", "Shipped", "Completed", "Canceled"),
      allowNull: false,
    });
  },
};
