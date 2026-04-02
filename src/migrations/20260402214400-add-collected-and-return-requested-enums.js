'use strict';

module.exports = {
   up: async (queryInterface, Sequelize) => {
      // Cập nhật ENUM cho bảng orders (thêm ReturnRequested)
      await queryInterface.changeColumn('orders', 'status', {
         type: Sequelize.ENUM('Pending', 'Shipped', 'Completed', 'Canceled', 'FailedDelivery', 'Returned to shop', 'ReturnRequested'),
         allowNull: true,
      });

      // Cập nhật ENUM cho bảng payments (Success, Failed, Pending, RefundPending, Refunded)
      await queryInterface.changeColumn('payments', 'status', {
         type: Sequelize.ENUM('Success', 'Failed', 'Pending', 'RefundPending', 'Refunded'),
         allowNull: true,
      });
   },

   down: async (queryInterface, Sequelize) => {
      // Revert lại các giá trị cũ
      await queryInterface.changeColumn('orders', 'status', {
         type: Sequelize.ENUM('Pending', 'Shipped', 'Completed', 'Canceled', 'FailedDelivery', 'Returned to shop'),
         allowNull: true,
      });

      await queryInterface.changeColumn('payments', 'status', {
         type: Sequelize.ENUM('Success', 'Failed', 'Pending', 'RefundPending', 'Refunded'),
         allowNull: true,
      });
   },
};
