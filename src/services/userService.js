import db from '../models/index';
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

const hashUserPassword = (userPassword) => {
   const hasPassword = bcrypt.hashSync(userPassword, salt);
   return hasPassword;
};
const getAllUsers = async () => {
   try {
      const users = await db.User.findAll({
         attributes: { exclude: ['password'] },
      });
      if (!users) {
         return {
            EM: 'user not found',
            EC: '0',
            DT: [],
         };
      }
      return {
         EM: 'Get list user success',
         EC: '0',
         DT: users,
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
const getUserById = async (id) => {
   try {
      const user = await db.User.findByPk(id, {
         attributes: { exclude: ['password'] },
      });
      if (!user) {
         return {
            EM: 'user not found',
            EC: '0',
            DT: [],
         };
      }
      console.log('>>>>>user', user);
      return {
         EM: 'Get user success',
         EC: '0',
         DT: user,
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
const createUser = async (data) => {
   try {
      if (!data.role_id) {
         return {
            EM: 'Vai trò là bắt buộc',
            EC: '1',
            DT: [],
         };
      }
      if (data.password) {
         data.password = hashUserPassword(data.password);
      }
      const user = await db.User.create(data);
      if (!user) {
         return {
            EM: 'create user fail',
            EC: '1',
            DT: [],
         };
      }
      return {
         EM: 'create user success',
         EC: '0',
         DT: user,
      };
   } catch (error) {
      console.log(error);
      return {
         EM: 'error from service create user',
         EC: '-1',
         DT: '',
      };
   }
};
const updateUser = async (id, data) => {
   try {
      // Tìm user hiện tại
      const user = await db.User.findOne({ where: { user_id: id } });
      if (!user) {
         return {
            EM: 'User not found',
            EC: '0',
            DT: [],
         };
      }

      // Xử lý mật khẩu trước khi kiểm tra thay đổi
      if (data.password) {
         data.password = hashUserPassword(data.password);
      } else {
         delete data.password;
      }

      // Kiểm tra nếu dữ liệu gửi lên giống với dữ liệu hiện có
      let nothingToUpdate = true;
      for (const key in data) {
         if (user[key] !== data[key]) {
            nothingToUpdate = false;
            break;
         }
      }

      if (nothingToUpdate) {
         return {
            EM: 'Nothing to update',
            EC: '0',
            DT: user,
         };
      }

      // Thực hiện bộ update
      const [affectedRows] = await db.User.update(data, {
         where: { user_id: id },
      });

      return {
         EM: 'Update user success',
         EC: '0',
         DT: affectedRows,
      };
   } catch (error) {
      console.log(error);
      return {
         EM: 'Error from service update user',
         EC: '-1',
         DT: '',
      };
   }
};
const deleteUser = async (id) => {
   try {
      const user = await db.User.findOne({ where: { user_id: id } });
      if (!user) {
         return {
            EM: 'User not found',
            EC: '0',
            DT: [],
         };
      }

      const affectedRows = await db.User.destroy({ where: { user_id: id } });
      return {
         EM: 'Delete user success',
         EC: '0',
         DT: affectedRows,
      };
   } catch (error) {
      console.log(error);
      return {
         EM: 'Error from service delete user',
         EC: '-1',
         DT: '',
      };
   }
};
const toggleUserStatus = async (id) => {
   try {
      const user = await db.User.findByPk(id);
      if (!user) {
         return {
            EM: 'User not found',
            EC: '1',
            DT: [],
         };
      }

      user.status = user.status === 'active' ? 'inactive' : 'active';
      await user.save();

      return {
         EM: `User ${user.status === 'active' ? 'activated' : 'deactivated'} successfully`,
         EC: '0',
         DT: user,
      };
   } catch (error) {
      console.log(error);
      return {
         EM: 'Error from service toggle status',
         EC: '-1',
         DT: '',
      };
   }
};

export default {
   getAllUsers,
   getUserById,
   createUser,
   updateUser,
   deleteUser,
   toggleUserStatus,
};
