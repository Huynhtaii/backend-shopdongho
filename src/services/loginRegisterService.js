import jwtAction from '../middleware/jwtAction';
import db from '../models/index';
let bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
const hashUserPassword = (userPassword) => {
   const hasPassword = bcrypt.hashSync(userPassword, salt);
   return hasPassword;
};
const checkEmailExist = async (userEmail) => {
   let user = await db.User.findOne({
      where: {
         email: userEmail,
      },
   });
   if (user) {
      return true;
   }
   return false;
};
const handleRegister = async (rawData) => {
   try {
      let isEmailExist = await checkEmailExist(rawData.email);
      if (isEmailExist === true) {
         return {
            EM: 'Email has existed',
            EC: '1',
         };
      }
      let hasPassword = hashUserPassword(rawData.password);
      await db.User.create({
         name: rawData.name,
         email: rawData.email,
         password: hasPassword,
         phone: rawData.phone || null,
         address: rawData.address || null,
         role_id: 2,
      });
      return {
         EM: 'Register successfully',
         EC: '0',
      };
   } catch (error) {
      console.log('Error at registerNewUser: ', error);
      return {
         EM: 'Error from service',
         EC: '-2',
      };
   }
};
const handleLogin = async (rawData) => {
   console.log('>>>>>>>>>>>>>rawData', rawData);
   try {
      let user = await db.User.findOne({
         where: {
            email: rawData.email,
         },
      });
      if (!user) {
         return {
            EM: 'Email or Password is incorrect',
            EC: '1',
         };
      }
      let checkPassword = bcrypt.compareSync(String(rawData.password), String(user.password));
      // let checkPassword = rawData.password === user.password;

      console.log('>>>>>>>checkPassword', checkPassword);
      console.log('>>>>>>>>>rawData.password', rawData.password);
      console.log('>>>>>>>>>>>>user.password, ', user.password);
      if (checkPassword === false) {
         return {
            EM: 'Email or Password is incorrect', //trả ra chung chung như thế này để hacker không biết email hay password sai mà tập trung tấn công vào
            EC: '2',
         };
      }
      const payload = {
         id: user.user_id,
         email: user.email,
         name: user.name,
         role_id: user.role_id,
      };
      const token = jwtAction.createJWT(payload);
      console.log('>>>>>>>>>>>>>token', token);
      return {
         EM: 'Login successfully',
         EC: '0',
         DT: {
            id: user.user_id,
            email: user.email,
            name: user.name,
            role_id: user.role_id,
            access_token: token,
         },
      };
   } catch (error) {
      console.log('Error at loginUser: ', error);
      return {
         EM: 'Error from service',
         EC: '-2',
      };
   }
};
const getInforAccount = async (id) => {
   try {
      let data = await db.User.findOne({
         where: {
            user_id: id,
         },
         attributes: ['user_id', 'name', 'email', 'phone', 'address', 'role_id'],
         include: [
            {
               model: db.Order,
               as: 'orders',
               attributes: ['order_id', 'order_date', 'status', 'total_amount'],
               include: [
                  {
                     model: db.OrderItem,
                     as: 'order_items',
                     attributes: ['quantity', 'price'],
                     include: [
                        {
                           model: db.Product,
                           attributes: ['name', 'description', 'price', 'discount_price']
                        }
                     ]
                  }
               ]
            }
         ]
      });

      if (!data) {
         return {
            EM: 'User not found',
            EC: '1',
            DT: null,
         };
      }

      return {
         EM: 'Get information successfully',
         EC: '0',
         DT: data,
      };
   } catch (error) {
      console.log('Error at getInforAccount: ', error);
      return {
         EM: 'Error from service',
         EC: '-2',
         DT: null,
      };
   }
}
const updateInforAccount = async (id, data) => {
   try {
      const user = await db.User.findByPk(id);
      if (!user) {
         return {
            EM: 'User not found',
            EC: '1',
            DT: null,
         };
      }

      const { name, phone, address } = data;

      // Kiểm tra dữ liệu có thay đổi hay không
      if (
         name === user.name &&
         phone === user.phone &&
         address === user.address
      ) {
         return {
            EM: 'Nothing to update',
            EC: '0',
            DT: user,
         };
      }

      // Chỉ cập nhật khi có thay đổi
      if (name) user.name = name;
      if (phone) user.phone = phone;
      if (address) user.address = address;

      await user.save();

      return {
         EM: 'Update information successfully',
         EC: '0',
         DT: user,
      };
   } catch (error) {
      console.log('Error at updateInforAccount: ', error);
      return {
         EM: 'Error from service',
         EC: '-2',
         DT: null,
      };
   }
};



export default {
   handleRegister,
   handleLogin,
   getInforAccount,
   updateInforAccount,
};
