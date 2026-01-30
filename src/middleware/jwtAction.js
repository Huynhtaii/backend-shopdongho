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
export default { createJWT, verifyJWT };
