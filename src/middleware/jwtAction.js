import jwt from 'jsonwebtoken';
require('dotenv').config();

// Routes không cần xác thực
const nonSecurePaths = [
   '/login/user', // Đăng nhập
   '/register/user', // Đăng ký
   '/logout/user', // Đăng xuất
   '/read-all/products', // Lấy danh sách sản phẩm
   'read/cart/:user_id',
   '/product/:id', // Chi tiết sản phẩm
   '/read-all/categories', // Lấy danh sách danh mục
   '/product-search', // Tìm kiếm sản phẩm
   '/recent-products', // Sản phẩm xem gần đây
   '/read-product-by-categories/:name', // Sản phẩm theo danh mục
   '/read-product-by-categories-with-pagination', // Phân trang sản phẩm theo danh mục
   '/getChatHistory/:userId', // Lấy lịch sử chat
   '/sendMessage', // Gửi tin nhắn mới
   '/getAllChat', // Lấy tất cả chat của user chat vs admin
   //API để test thanh toán ngân hàng, tạm thời mở khóa
   '/create/order',
   '/update-payment',
];

const apiPrefix = '/api/v1';

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
   if (req.headers.authorization?.startsWith('Bearer ')) {
      return req.headers.authorization.split(' ')[1];
   }
   return null;
};

const checkUserJWT = (req, res, next) => {
   try {
      // Kiểm tra xem path hiện tại có phải là public route không
      const isPublicRoute = nonSecurePaths.some((route) => {
         return req.path === route || req.path === apiPrefix + route || req.path.startsWith(apiPrefix + route); // Cho các route có params
      });

      if (isPublicRoute) {
         return next();
      }

      const token = req.cookies?.access_token || extractToken(req);

      if (!token) {
         return res.status(401).json({
            EM: 'Vui lòng đăng nhập để thực hiện thao tác này!',
            EC: -1,
            DT: '',
         });
      }

      const decoded = verifyJWT(token);
      if (!decoded) {
         res.clearCookie('access_token');
         return res.status(401).json({
            EM: 'Token không hợp lệ hoặc đã hết hạn!',
            EC: -1,
            DT: '',
         });
      }

      req.user = decoded;
      req.token = token;
      next();
   } catch (error) {
      console.log('error checkUserJWT', error);
      return res.status(500).json({
         EM: 'Internal server error',
         EC: '-1',
         DT: '',
      });
   }
};

const checkUserPermission = (req, res, next) => {
   if (
      nonSecurePaths.includes(req.path) ||
      req.path.startsWith('/api/v1/login') ||
      req.path.startsWith('/api/v1/register')
   ) {
      return next();
   }

   if (req.user) {
      next();
   } else {
      return res.status(401).json({
         EM: 'Vui lòng đăng nhập!',
         EC: -1,
         DT: '',
      });
   }
};

export default {
   createJWT,
   verifyJWT,
   checkUserJWT,
   checkUserPermission,
};
