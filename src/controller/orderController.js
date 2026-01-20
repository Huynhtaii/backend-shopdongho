import orderService from '../services/orderService';
const getAllOrders = async (req, res) => {
   try {
      const data = await orderService.getAllOrders();
      return res.status(200).json({
         EM: data.EM,
         EC: data.EC,
         DT: data.DT,
      });
   } catch (error) {
      console.log(error);
      return res.status(500).json({
         EM: 'error from server',
         EC: '-1',
         DT: '',
      });
   }
};
const getOrderById = async (req, res) => {
   try {
      const { id } = req.params;
      const data = await orderService.getOrderById(id);
      return res.status(200).json({
         EM: data.EM,
         EC: data.EC,
         DT: data.DT,
      });
   } catch (error) {
      console.log(error);
      return res.status(500).json({
         EM: 'error from server',
         EC: '-1',
         DT: '',
      });
   }
};
const createOrder = async (req, res) => {
   try {
      const data = await orderService.createOrder(req.body);
      return res.status(200).json({
         EM: data.EM,
         EC: data.EC,
         DT: data.DT,
      });
   } catch (error) {
      console.log(error);
      return res.status(500).json({
         EM: 'error from server',
         EC: '-1',
         DT: '',
      });
   }
};
const updateOrder = async (req, res) => {
   try {
      const { id } = req.params;
      const data = await orderService.updateOrder(id, req.body);
      return res.status(200).json({
         EM: data.EM,
         EC: data.EC,
         DT: data.DT,
      });
   } catch (error) {
      console.log(error);
      return res.status(500).json({
         EM: 'error from server',
         EC: '-1',
         DT: '',
      });
   }
};
const deleteOrder = async (req, res) => {
   try {
      const { id } = req.params;
      const data = await orderService.deleteOrder(id);
      return res.status(200).json({
         EM: data.EM,
         EC: data.EC,
         DT: data.DT,
      });
   } catch (error) {
      console.log(error);
      return res.status(500).json({
         EM: 'error from server',
         EC: '-1',
         DT: '',
      });
   }
};
export default {
   getAllOrders,
   getOrderById,
   createOrder,
   updateOrder,
   deleteOrder,
};
