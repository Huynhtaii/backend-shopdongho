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
            email: user.email,
            name: user.name,
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
export default {
   handleRegister,
   handleLogin,
};
