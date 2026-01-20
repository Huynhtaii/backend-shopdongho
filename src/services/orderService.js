import db from '../models/index';
const getAllOrders = async () => {
   try {
      const orders = await db.Order.findAll();
      if (!orders) {
         return {
            EM: 'orders not found',
            EC: '0',
            DT: [],
         };
      }
      return {
         EM: 'Get orders success',
         EC: '0',
         DT: orders,
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
      const order = await db.Order.create(data);
      if (!order) {
         return {
            EM: 'create order fail',
            EC: '0',
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
         EM: 'error from service',
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
};
