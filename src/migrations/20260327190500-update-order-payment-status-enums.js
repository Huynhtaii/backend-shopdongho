'use strict';

module.exports = {
   up: async (queryInterface, Sequelize) => {
      // Vì MySQL không hỗ trợ lệnh ALTER TYPE cho ENUM như PostgreSQL, ta thay đổi kiểu cột bằng ALTER TABLE ... MODIFY
      // Bảng orders: thêm 'Returned to shop'
      await queryInterface.changeColumn('orders', 'status', {
         type: Sequelize.ENUM('Pending', 'Shipped', 'Completed', 'Canceled', 'FailedDelivery', 'Returned to shop'),
         allowNull: true,
      });

      // Bảng payments: thêm 'RefundPending', 'Refunded'
      await queryInterface.changeColumn('payments', 'status', {
         type: Sequelize.ENUM('Success', 'Failed', 'Pending', 'RefundPending', 'Refunded'),
         allowNull: true,
      });
   },

   down: async (queryInterface, Sequelize) => {
      // Khi revert, xoá các giá trị mới nếu muốn. Tuy nhiên thu hẹp ENUM có thể gây lỗi nếu có dòng đang trỏ tới giá trị cũ.
      // Do đó, revert là một thao tác nguy hiểm. Nếu cần, ta ép về cấu trúc cũ:
      await queryInterface.changeColumn('orders', 'status', {
         type: Sequelize.ENUM('Pending', 'Shipped', 'Completed', 'Canceled', 'FailedDelivery'),
         allowNull: true,
      });

      await queryInterface.changeColumn('payments', 'status', {
         type: Sequelize.ENUM('Success', 'Failed', 'Pending'),
         allowNull: true,
      });
   },
};
