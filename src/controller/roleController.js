import Role from '../services/roleService.js';
const getAllRoles = async (req, res) => {
   try {
      const data = await Role.getAllRoles();
      return res.status(200).json({
         EM: data.EM,
         EC: data.EC,
         DT: data.DT,
      });
   } catch (error) {
      console.error('Get all roles error:', error);
      return res.status(500).json({
         EM: 'error from server',
         EC: '-1',
         DT: '',
      });
   }
};

export default {
   getAllRoles,
};
