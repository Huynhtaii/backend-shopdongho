import db from '../models';
const getAllRoles = async () => {
   try {
      const data = await db.Role.findAll();
      return {
         EM: 'Get all roles successfully',
         EC: '0',
         DT: data,
      };
   } catch (error) {
      console.error('Get all roles error:', error);
      return {
         EM: 'Get all roles error',
         EC: '-1',
         DT: '',
      };
   }
};
export default {
   getAllRoles,
};
