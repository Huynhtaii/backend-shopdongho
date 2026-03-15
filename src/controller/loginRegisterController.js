import loginRegisterService from '../services/loginRegisterService';
const handleRegister = async (req, res) => {
   try {
      const { name, email, password, adress, phone } = req.body;
      if (!email || !password) {
         return res.status(200).json({
            EM: 'Please provide email and password',
            EC: '-1',
            DT: '',
         });
      }
      if (password && password.length < 4) {
         return res.status(200).json({
            EM: 'Passwords must be more than 3 characters',
            EC: '-1',
            EC: '1',
            DT: '',
         });
      }
      let data = await loginRegisterService.handleRegister(req.body);
      return res.status(200).json({
         EM: data.EM,
         EC: data.EC,
         DT: data.DT,
      });
   } catch (error) {
      console.log('Error at handleRegister: ', error);
      return res.status(500).json({
         EM: 'Erorr from server',
         EC: '-1',
         DT: '',
      });
   }
};
const handleLogin = async (req, res) => {
   try {
      const { email, password } = req.body;
      if (!email || !password) {
         return res.status(200).json({
            EM: 'Missing required fields',
            EC: '-1',
            DT: '',
         });
      }
      let data = await loginRegisterService.handleLogin(req.body);
      if (data && data.DT && data.DT.access_token) {
         res.cookie('access_token', data.DT.access_token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
         });
      }
      return res.status(200).json({
         EM: data.EM,
         EC: data.EC,
         DT: data.DT,
      });
   } catch (error) {
      console.log('Error at handleLogin: ', error);
      return res.status(500).json({
         EM: 'Internal server error',
         EC: '-1',
         DT: '',
      });
   }
};
const handleLogout = async (req, res) => {
   try {
      res.clearCookie('access_token');
      return res.status(200).json({
         EM: 'Logout successfully',
         EC: '0',
         DT: '',
      });
   } catch (error) {
      console.log('Error at handleLogout: ', error);
      return res.status(500).json({
         EM: 'Internal server error',
         EC: '-1',
         DT: '',
      });
   }
};

const getInforAccount = async (req, res) => {
   try {
      const id = req.params.id;
      if (!id) {
         return res.status(200).json({
            EM: 'Missing required fields',
            EC: '-1',
            DT: '',
         });
      }
      let data = await loginRegisterService.getInforAccount(id);
      return res.status(200).json({
         EM: data.EM,
         EC: data.EC,
         DT: data.DT,
      });
   } catch (error) {
      console.log('Error at getInforAccount: ', error);
      return res.status(500).json({
         EM: 'Internal server error',
         EC: '-1',
         DT: '',
      });
   }
};
const updateInforAccount = async (req, res) => {
   try {
      const id = req.params.id;
      const { name, phone, address } = req.body;
      if (!id) {
         return res.status(200).json({
            EM: 'Missing required fields',
            EC: '-1',
            DT: '',
         });
      }
      let data = await loginRegisterService.updateInforAccount(id, req.body);
      return res.status(200).json({
         EM: data.EM,
         EC: data.EC,
         DT: data.DT,
      });
   } catch (error) {
      console.log('Error at updateInforAccount: ', error);
      return res.status(500).json({
         EM: 'Internal server error',
         EC: '-1',
         DT: '',
      });
   }
};
const getAccount = async (req, res) => {

   if (!req.user) {
      return res.status(401).json({ EM: "User not authenticated", EC: -1, DT: "" });
   }

   return res.status(200).json({
      EM: "Get User Account OK!",
      EC: "0",
      DT: {
         id: req.user.id,
         email: req.user.email,
         username: req.user.name,
         role_id: req.user.role_id.toString(),
         access_token: req.token,
      },
   });
};
const handleForgotPassword = async (req, res) => {
   try {
      const { email } = req.body;
      if (!email) {
         return res.status(200).json({
            EM: 'Please provide an email',
            EC: '-1',
            DT: '',
         });
      }
      let data = await loginRegisterService.forgotPassword(email);
      return res.status(200).json({
         EM: data.EM,
         EC: data.EC,
         DT: '',
      });
   } catch (error) {
      console.log('Error at handleForgotPassword: ', error);
      return res.status(500).json({
         EM: 'Internal server error',
         EC: '-1',
         DT: '',
      });
   }
};

const handleResetPassword = async (req, res) => {
   try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
         return res.status(200).json({
            EM: 'Missing required fields',
            EC: '-1',
            DT: '',
         });
      }
      let data = await loginRegisterService.resetPassword(token, newPassword);
      return res.status(200).json({
         EM: data.EM,
         EC: data.EC,
         DT: '',
      });
   } catch (error) {
      console.log('Error at handleResetPassword: ', error);
      return res.status(500).json({
         EM: 'Internal server error',
         EC: '-1',
         DT: '',
      });
   }
};

export default {
   handleRegister,
   handleLogin,
   getInforAccount,
   updateInforAccount,
   handleLogout,
   getAccount,
   handleForgotPassword,
   handleResetPassword,
};
