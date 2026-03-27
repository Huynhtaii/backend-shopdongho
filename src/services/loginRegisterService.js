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
      const newUser = await db.User.create({
         name: rawData.name,
         email: rawData.email,
         password: hasPassword,
         phone: rawData.phone || null,
         address: rawData.address || null,
         created_at: new Date().toISOString(),
         role_id: 2,
      });

      await db.Cart.create({
         user_id: newUser.user_id,
         created_at: new Date().toISOString(),
         updated_at: new Date().toISOString(),
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
      if (user.status === 'inactive') {
         return {
            EM: 'Tài khoản của bạn đã bị vô hiệu hoá. Vui lòng liên hệ quản trị viên.',
            EC: '1',
            DT: '',
         };
      }
      const isPasswordValid = bcrypt.compareSync(String(rawData.password), String(user.password));
      if (isPasswordValid === false) {
         return {
            EM: 'Email or Password is incorrect', //trả ra chung chung như thế này để hacker không biết email hay password sai mà tập trung tấn công vào
            EC: '1',
         };
      }
      const payload = {
         id: user.user_id,
         email: user.email,
         name: user.name,
         role_id: user.role_id,
      };
      const token = jwtAction.createJWT(payload);
      return {
         EM: 'Login successfully',
         EC: '0',
         DT: {
            id: user.user_id,
            email: user.email,
            name: user.name,
            role_id: user.role_id.toString(),
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
         attributes: ['name', 'email', 'phone', 'address'],
         include: [
            {
               model: db.Order,
               as: 'orders',
               separate: true,
               order: [['order_date', 'DESC']],
               attributes: ['order_id', 'order_date', 'status', 'total_amount'],
               include: [
                  {
                     model: db.OrderItem,
                     as: 'order_items',
                     attributes: ['product_id', 'quantity', 'price'],
                     include: [
                        {
                           model: db.Product,
                           attributes: ['name', 'description', 'price', 'discount_price'],
                           include: [
                              {
                                 model: db.ProductImage,
                                 attributes: ['url'],
                              },
                           ],
                        },
                     ],
                  },
                  {
                     model: db.Payment,
                     attributes: ['status', 'payment_method', 'amount'],
                  },
                  {
                     model: db.Feedback,
                     as: 'Feedbacks',
                     attributes: ['feedback_id', 'rating', 'comments'],
                  },
               ],
            },
         ],
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
};
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
      if (name === user.name && phone === user.phone && address === user.address) {
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

const forgotPassword = async (email) => {
   try {
      let user = await db.User.findOne({
         where: { email: email },
      });
      if (!user) {
         return {
            EM: 'Email does not exist',
            EC: '1',
         };
      }

      const crypto = require('crypto');
      const token = crypto.randomBytes(32).toString('hex');
      const tokenExpires = new Date(Date.now() + 3600000); // 1 hour

      user.resetToken = token;
      user.resetTokenExpires = tokenExpires;
      await user.save();

      const emailService = require('./emailService');
      const resetLink = `${process.env.REACT_URL}/reset-password/${token}`;
      await emailService.sendResetPasswordEmail(email, resetLink);

      return {
         EM: 'Reset password email sent',
         EC: '0',
      };
   } catch (error) {
      console.log('Error at forgotPasswordService: ', error);
      return {
         EM: 'Error from service',
         EC: '-2',
      };
   }
};

const resetPassword = async (token, newPassword) => {
   try {
      const { Op } = require('sequelize');
      let user = await db.User.findOne({
         where: {
            resetToken: token,
            resetTokenExpires: {
               [Op.gt]: new Date(),
            },
         },
      });

      if (!user) {
         return {
            EM: 'Invalid or expired token',
            EC: '1',
         };
      }

      user.password = hashUserPassword(newPassword);
      user.resetToken = null;
      user.resetTokenExpires = null;
      await user.save();

      return {
         EM: 'Password reset successfully',
         EC: '0',
      };
   } catch (error) {
      console.log('Error at resetPasswordService: ', error);
      return {
         EM: 'Error from service',
         EC: '-2',
      };
   }
};

export default {
   handleRegister,
   handleLogin,
   getInforAccount,
   updateInforAccount,
   forgotPassword,
   resetPassword,
};
