import addressService from '../services/addressService';

const getUserAddresses = async (req, res) => {
   try {
      const { user_id } = req.params;
      const data = await addressService.getUserAddresses(user_id);
      return res.status(200).json({
         EM: data.EM,
         EC: data.EC,
         DT: data.DT,
      });
   } catch (error) {
      console.error(error);
      return res.status(500).json({
         EM: 'error from server',
         EC: '-1',
         DT: '',
      });
   }
};

const createAddress = async (req, res) => {
   try {
      const data = await addressService.createAddress(req.body);
      return res.status(200).json({
         EM: data.EM,
         EC: data.EC,
         DT: data.DT,
      });
   } catch (error) {
      console.error(error);
      return res.status(500).json({
         EM: 'error from server',
         EC: '-1',
         DT: '',
      });
   }
};

const updateAddress = async (req, res) => {
   try {
      const { id } = req.params;
      const data = await addressService.updateAddress(id, req.body);
      return res.status(200).json({
         EM: data.EM,
         EC: data.EC,
         DT: data.DT,
      });
   } catch (error) {
      console.error(error);
      return res.status(500).json({
         EM: 'error from server',
         EC: '-1',
         DT: '',
      });
   }
};

const deleteAddress = async (req, res) => {
   try {
      const { id } = req.params;
      const data = await addressService.deleteAddress(id);
      return res.status(200).json({
         EM: data.EM,
         EC: data.EC,
         DT: data.DT,
      });
   } catch (error) {
      console.error(error);
      return res.status(500).json({
         EM: 'error from server',
         EC: '-1',
         DT: '',
      });
   }
};

const setDefaultAddress = async (req, res) => {
   try {
      const { id } = req.params;
      const { user_id } = req.body;
      const data = await addressService.setDefaultAddress(user_id, id);
      return res.status(200).json({
         EM: data.EM,
         EC: data.EC,
         DT: data.DT,
      });
   } catch (error) {
      console.error(error);
      return res.status(500).json({
         EM: 'error from server',
         EC: '-1',
         DT: '',
      });
   }
};

export default {
   getUserAddresses,
   createAddress,
   updateAddress,
   deleteAddress,
   setDefaultAddress,
};
