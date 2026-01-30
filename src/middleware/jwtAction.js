import jwt from 'jsonwebtoken';
require('dotenv').config();
const createJWT = (payload) => {
   let key = process.env.JWT_SECRET;
   console.log('>>>key=', key);
   let token = null;
   try {
      token = jwt.sign(payload, key, { expiresIn: process.env.JWT_EXPIRE });
      // console.log("token", token);
      return token;
   } catch (error) {
      console.log('error createJWT', error);
   }
   return token;
};
const verifyJWT = (token) => {
   let key = process.env.JWT_SECRET;
   let decoded = null;
   try {
      decoded = jwt.verify(token, key);
   } catch (error) {
      console.log('error verifyJWT', error);
   }
   // console.log("data", data);
   return decoded;
};

const checkUserJWT = (req, res, next) => {
   const token = req.headers.authorization?.split(' ')[1];
   
   if (!token) {
      return res.status(401).json({
         EM: 'No token provided',
         EC: '-1',
         DT: '',
      });
   }

   const decoded = verifyJWT(token);
   if (!decoded) {
      return res.status(401).json({
         EM: 'Invalid token',
         EC: '-1',
         DT: '',
      });
   }

   req.user = decoded;
   req.userId = decoded.id;
   next();
};

export default { createJWT, verifyJWT, checkUserJWT };
