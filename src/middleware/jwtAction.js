import jwt from 'jsonwebtoken';
require('dotenv').config();

// Định nghĩa các routes không cần xác thực
const publicRoutes = [
   "/login",
   "/register",
   "/logout/user",
   "/read-all/products",      // cho phép xem sản phẩm
   "/recent-products",
   "/read-all/categories",    // cho phép xem categories
   "/product/",               // cho phép xem chi tiết sản phẩm
   "/product-search",         // cho phép tìm kiếm sản phẩm
   "/read-product-by-categories", // cho phép xem sản phẩm theo category
   "/read-product-by-categories-with-pagination"
];

const apiPrefix = "/api/v1";

const createJWT = (payload) => {
   let key = process.env.JWT_SECRET;
   try {
      return jwt.sign(payload, key, { expiresIn: process.env.JWT_EXPIRE });
   } catch (error) {
      console.log('error createJWT', error);
      return null;
   }
};

const verifyJWT = (token) => {
   let key = process.env.JWT_SECRET;
   try {
      return jwt.verify(token, key);
   } catch (error) {
      console.log('error verifyJWT', error);
      return null;
   }
};

const extractToken = (req) => {
   if (req.headers.authorization?.startsWith("Bearer ")) {
      return req.headers.authorization.split(" ")[1];
   }
   return null;
};

const checkUserJWT = (req, res, next) => {
   // Kiểm tra xem path hiện tại có phải là public route không
   const isPublicRoute = publicRoutes.some(route => {
      // Kiểm tra cả với prefix và không có prefix
      return req.path === route ||
         req.path === apiPrefix + route ||
         req.path.startsWith(apiPrefix + route); // Cho các route có params
   });

   if (isPublicRoute) {
      return next();
   }

   // Kiểm tra token
   const token = req.cookies?.access_token || extractToken(req);

   if (!token) {
      return res.status(401).json({
         EM: "Vui lòng đăng nhập để thực hiện thao tác này!",
         EC: -1,
         DT: "",
      });
   }

   const decoded = verifyJWT(token);
   if (!decoded) {
      return res.status(401).json({
         EM: "Token không hợp lệ hoặc đã hết hạn!",
         EC: -1,
         DT: "",
      });
   }

   // Lưu thông tin user vào request
   req.user = decoded;
   req.token = token;
   next();
};

// Middleware kiểm tra role Admin
const checkAdminRole = (req, res, next) => {
   if (req.user && req.user.role_id === 1) { // Giả sử role_id 1 là Admin
      next();
   } else {
      return res.status(403).json({
         EM: "Bạn không có quyền thực hiện thao tác này!",
         EC: -1,
         DT: "",
      });
   }
};

export default {
   createJWT,
   verifyJWT,
   checkUserJWT,
   checkAdminRole
};
