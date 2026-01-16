'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('payments', {
      payment_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      payment_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      amount: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
      },
      payment_method: {
        type: Sequelize.ENUM("Credit Card", "PayPal", "COD", "Bank Transfer"),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("Success", "Failed", "Pending"),
        allowNull: false,
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'order_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('payments');
  }
};
