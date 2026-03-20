import db from '../models/index';
import emailService from './emailService';

const getAllOrders = async () => {
   try {
      const orders = await db.Order.findAll({
         include: [
            {
               model: db.OrderItem,
               as: 'order_items', // Thêm alias ở đây
               include: [
                  {
                     model: db.Product,
                     as: 'Product', // Thêm alias cho Product nếu có
                     attributes: ['product_id', 'name', 'price', 'discount_price'],
                     include: [
                        {
                           model: db.ProductImage,
                           as: 'ProductImages', // Thêm alias cho ProductImage nếu có
                           attributes: ['url'],
                           limit: 1,
                        },
                     ],
                  },
               ],
            },
            {
               model: db.User,
               as: 'User', // Thêm alias cho User
               attributes: ['user_id', 'name', 'email', 'phone', 'address'],
            },
            {
               model: db.Payment,
               attributes: ['payment_id', 'status', 'payment_method', 'amount'],
            },
         ],
         order: [['order_date', 'DESC']],
      });

      // Tính toán thống kê — chỉ tính doanh thu từ đơn đã hoàn thành
      const totalRevenue = orders
         .filter((order) => order.status === 'Completed')
         .reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
      const totalProducts = await db.Product.count();

      return {
         EM: 'Get orders success',
         EC: '0',
         DT: {
            orders,
            stats: {
               totalRevenue,
               totalOrders: orders.length,
               totalProducts,
               totalCustomers: new Set(orders.map((order) => order.user_id)).size,
            },
         },
      };
   } catch (error) {
      console.error('Error:', error);
      return {
         EM: 'Error getting orders',
         EC: '1',
         DT: [],
      };
   }
};
const getOrderById = async (id) => {
   try {
      const order = await db.Order.findByPk(id);
      if (!order) {
         return {
            EM: 'order not found',
            EC: '0',
            DT: [],
         };
      }
      return {
         EM: 'Get order success',
         EC: '0',
         DT: order,
      };
   } catch (error) {
      console.log(error);
      return {
         EM: 'error from service',
         EC: '-1',
         DT: '',
      };
   }
};
const createOrder = async (data) => {
   try {
      // ✅ Đổi `data.products` thành `data.items`
      if (!data.items || !Array.isArray(data.items)) {
         return {
            EM: 'Invalid items data',
            EC: '-1',
            DT: '',
         };
      }

      // ✅ Đổi `data.products.map(...)` thành `data.items.map(...)`
      const productIds = data.items.map((p) => p.product_id);
      const products = await db.Product.findAll({
         where: { product_id: productIds },
         attributes: ['product_id', 'price'],
      });

      // ✅ Đổi `data.products.forEach(...)` thành `data.items.forEach(...)`
      let totalAmount = 0;
      data.items.forEach((item) => {
         const product = products.find((p) => p.product_id === item.product_id);
         if (product) {
            totalAmount += product.price * item.quantity;
         }
      });

      // Tạo đơn hàng
      const newOrder = {
         user_id: data.user_id,
         order_date: new Date(),
         total_amount: totalAmount,
         status: data.status || 'Pending',
      };

      const order = await db.Order.create(newOrder);

      if (!order) {
         return {
            EM: 'Create order failed',
            EC: '1',
            DT: [],
         };
      }

      return {
         EM: 'Create order success',
         EC: '0',
         DT: order,
      };
   } catch (error) {
      console.log(error);
      return {
         EM: 'Error from service',
         EC: '-1',
         DT: '',
      };
   }
};

const updateOrder = async (id, data) => {
   try {
      const order = await db.Order.findByPk(id);
      if (!order) {
         return {
            EM: 'order not found',
            EC: '0',
            DT: [],
         };
      }

      // Check if there are any changes
      let nothingToUpdate = true;
      for (const key in data) {
         // Bỏ qua các trường không cần so sánh
         if (key === 'order_id') continue;
         if (key === 'order_date') {
            const orderDate = new Date(order[key]).toISOString();
            const dataDate = new Date(data[key]).toISOString();
            if (orderDate !== dataDate) {
               nothingToUpdate = false;
               break;
            }
         } else if (key === 'total_amount') {
            if (Number(order[key]) !== Number(data[key])) {
               nothingToUpdate = false;
               break;
            }
         } else {
            if (order[key] !== data[key]) {
               nothingToUpdate = false;
               break;
            }
         }
      }

      if (nothingToUpdate) {
         return {
            EM: 'Nothing to update',
            EC: '0',
            DT: order,
         };
      }

      await order.update(data);
      return {
         EM: 'update order success',
         EC: '0',
         DT: order,
      };
   } catch (error) {
      console.log(error);
      return {
         EM: 'error from service',
         EC: '-1',
         DT: '',
      };
   }
};
const updateOrderStatus = async (id, status, paymentStatus) => {
   try {
      const order = await db.Order.findByPk(id, {
         include: [
            {
               model: db.User,
               as: 'User',
               attributes: ['email', 'name'],
            },
            {
               model: db.OrderItem,
               as: 'order_items',
               include: [
                  {
                     model: db.Product,
                     as: 'Product',
                     attributes: ['name'],
                  },
               ],
            },
            {
               model: db.Payment,
            },
         ],
      });

      if (!order) {
         return {
            EM: 'Order not found',
            EC: '0',
            DT: [],
         };
      }

      // Cập nhật trạng thái đơn hàng nếu có
      if (status && order.status !== status) {
         await order.update({ status });
      }

      // Cập nhật trạng thái thanh toán nếu có
      if (paymentStatus && order.Payment) {
         await order.Payment.update({ status: paymentStatus });
      }

      // Gửi email thông báo
      if (order.User && order.User.email) {
         const orderDetails = {
            order_id: order.order_id,
            nameProduct: order.order_items?.map((item) => item.Product?.name || 'Sản phẩm').join(', ') || 'Đơn hàng',
            quantity: order.order_items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0,
            order_date: order.order_date,
            total_amount: order.total_amount,
            status: status,
         };

         await emailService.sendOrderStatusUpdate(order.User.email, orderDetails, status);
      }

      return {
         EM: 'Update order status success',
         EC: '0',
         DT: order,
      };
   } catch (error) {
      console.log(error);
      return {
         EM: 'Error from service',
         EC: '-1',
         DT: '',
      };
   }
};
const deleteOrder = async (id) => {
   try {
      const order = await db.Order.findByPk(id);
      if (!order) {
         return {
            EM: 'order not found',
            EC: '0',
            DT: [],
         };
      }

      await order.destroy();
      return {
         EM: 'Delete order success',
         EC: '0',
         DT: order,
      };
   } catch (error) {
      console.log(error);
      return {
         EM: 'error from service',
         EC: '-1',
         DT: '',
      };
   }
};
export default {
   getAllOrders,
   getOrderById,
   createOrder,
   updateOrder,
   deleteOrder,
   updateOrderStatus,
};
