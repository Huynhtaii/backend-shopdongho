import userService from '../services/userService';
const getAllUsers = async (req, res) => {
   try {
      const data = await userService.getAllUsers();
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
const getUserById = async (req, res) => {
   try {
      const { id } = req.params;
      console.log('>>>>>id in cotroller', id);
      const data = await userService.getUserById(id);
      console.log('>>>>>data', data);
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
const createUser = async (req, res) => {
   try {
      const data = await userService.createUser(req.body);
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
const updateUser = async (req, res) => {
   try {
      const { id } = req.params;
      const data = await userService.updateUser(id, req.body);
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
const deleteUser = async (req, res) => {
   try {
      const { id } = req.params;
      const data = await userService.deleteUser(id);
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
   getAllUsers,
   getUserById,
   createUser,
   updateUser,
   deleteUser,
};
