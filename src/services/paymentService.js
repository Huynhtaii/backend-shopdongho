import db from '../models/index';
import emailService from '../services/emailService';
const updatePayment = async (data) => {
   let transaction;
   try {
      transaction = await db.sequelize.transaction();
      console.log('data >>>>>>>>>>>>>>>>>>>>', data);
      // 1. Tạo order mới
      const newOrder = await db.Order.create(
         {
            user_id: data.id,
            order_date: new Date(),
            total_amount: data.totalAmount,
            status: 'Pending',
         },
         { transaction },
      );

      // 2. Tạo order_items từ cartItems
      const orderItems = data.cartItem.map((item) => {
         const price = item.Product?.discount_price || item.Product?.price || 0;
         return {
            order_id: newOrder.order_id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: price,
         };
      });

      await db.OrderItem.bulkCreate(orderItems, { transaction });

      // 3. Xóa cart_items
      const cartItemIds = data.cartItem.map((item) => item.cart_item_id);
      await db.CartItem.destroy(
         {
            where: {
               cart_item_id: cartItemIds,
            },
         },
         { transaction },
      );

      // 4. Tạo payment record
      await db.Payment.create(
         {
            order_id: newOrder.order_id,
            payment_date: new Date(),
            amount: data.totalAmount,
            payment_method: data.paymentMethod,
            status: data.paymentMethod === 'cod' ? 'Pending' : 'Success',
         },
         { transaction },
      );

      await transaction.commit();

      // Gửi email không chặn quy trình (dùng try-catch riêng)
      try {
         const nameProduct = data.cartItem
            .map((item) => (item.Product?.name || 'Sản phẩm') + ' - Số Lượng: ' + item.quantity)
            .join(', ');

         await emailService.sendOrderConfirmation(
            data.email,
            {
               nameProduct: nameProduct,
               order_id: newOrder.order_id,
               order_date: newOrder.order_date,
               total_amount: data.totalAmount,
               status: 'Pending',
            },
            data.paymentMethod,
         );
      } catch (emailError) {
         console.error('Lỗi khi gửi email xác nhận:', emailError);
      }

      return {
         EM: 'Payment processed successfully',
         EC: 0,
         DT: newOrder,
      };
   } catch (error) {
      if (transaction && !transaction.finished) await transaction.rollback();
      console.error('Error in updatePayment:', error);
      return {
         EM: 'Error processing payment: ' + error.message,
         EC: -1,
         DT: null,
      };
   }
};
export default {
   updatePayment,
};
