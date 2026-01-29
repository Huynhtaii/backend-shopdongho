import jwt from 'jsonwebtoken';
require('dotenv').config();

// Routes không cần xác thực
const nonSecurePaths = [
   "/login/user",          // Đăng nhập
   "/register/user",       // Đăng ký
   "/logout/user",         // Đăng xuất
   "/read-all/products",   // Lấy danh sách sản phẩm
   "/product/:id",         // Chi tiết sản phẩm
   "/read-all/categories", // Lấy danh sách danh mục
   "/product-search",      // Tìm kiếm sản phẩm
   "/recent-products",     // Sản phẩm xem gần đây
   "/read-product-by-categories/:name", // Sản phẩm theo danh mục
   "/read-product-by-categories-with-pagination" // Phân trang sản phẩm theo danh mục
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
   const isPublicRoute = nonSecurePaths.some(route => {
      return req.path === route ||
         req.path === apiPrefix + route ||
         req.path.startsWith(apiPrefix + route); // Cho các route có params
   });

   if (isPublicRoute) {
      return next();
   }

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

   req.user = decoded;
   req.token = token;
   next();
};

// Middleware kiểm tra role Admin
const checkAdminRole = (req, res, next) => {
   if (!req.user) {
      return res.status(401).json({
         EM: "Vui lòng đăng nhập!",
         EC: -1,
         DT: "",
      });
   }

   if (req.user.role_id === 1) { // role_id 1 là Admin
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
