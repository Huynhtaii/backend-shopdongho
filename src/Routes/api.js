import express from 'express';
import userController from '../controller/userController';
import statisticsController from '../controller/statisticsController';
import productController from '../controller/productController';
import categoryController from '../controller/categoryController';
import orderController from '../controller/orderController';
import { upload } from '../middleware/uploadImage';
import { uploadCategory } from '../middleware/uploadCategoryImage';
import roleController from '../controller/roleController';
import loginRegisterController from '../controller/loginRegisterController';
import jwtAction from '../middleware/jwtAction';
import cartController from '../controller/cartController';
import messageController from '../controller/messageController';
import paymentController from '../controller/paymentController';
import aiController from '../controller/aiController';
import brandController from '../controller/brandController';
import feedbackController from '../controller/feedbackController';
const router = express.Router();

const initAPIRoutes = (app) => {
   // PUBLIC ROUTES (không cần đăng nhập)
   router.post('/ai/consult', aiController.consultAI);
   router.get('/ai/history', aiController.getChatHistory);
   // Brand Public Routes
   router.get('/read-all/brands', brandController.getAllBrands);
   router.get('/brand/:id', brandController.getBrandById);
   router.get('/read-all/products', productController.getAllProducts);
   router.get('/recent-products', productController.getResentProducts);
   router.get('/product/:id', productController.getProductById);
   router.get('/read-all/categories', categoryController.getAllCategories);
   router.get('/product-search', productController.searchProduct);
   router.get('/read-product-by-categories/:name', productController.getProductByCategories);
   router.get('/read-product-by-categories-with-pagination', productController.getProductByCategoriesWithPaginate);
   router.get('/getChatHistory/:userId', messageController.getChatHistory); // Lấy lịch sử chat
   router.post('/sendMessage', messageController.sendMessage); // Gửi tin nhắn mới
   router.get('/getAllChat', messageController.getAllChat); // Lấy tất cả chat của user chat vs admin
   // router.get('/getUnreadCounts', messageController.getUnreadCounts);  // Lấy số tin nhắn chưa đọc
   // router.post('/markAsRead/:userId', messageController.markAsRead);  // Đánh dấu tin nhắn đã đọc
   //API PAYMENT
   router.post('/update-payment', paymentController.updatePayment);

   // AUTH ROUTES
   router.post('/register/user', loginRegisterController.handleRegister);
   router.post('/login/user', loginRegisterController.handleLogin);
   router.post('/logout/user', loginRegisterController.handleLogout);
   router.post('/forgot-password', loginRegisterController.handleForgotPassword);
   router.post('/reset-password', loginRegisterController.handleResetPassword);

   // USER PROTECTED ROUTES (cần JWT)
   router.get('/read/account-user/:id', jwtAction.checkUserJWT, loginRegisterController.getInforAccount);
   router.put('/update/account-user/:id', jwtAction.checkUserJWT, loginRegisterController.updateInforAccount);
   router.get('/account', jwtAction.checkUserJWT, loginRegisterController.getAccount);

   // Cart Routes
   router.get('/read/cart/:user_id', jwtAction.checkUserJWT, cartController.getCartByUserId);
   router.post('/create/cart-item/:user_id', jwtAction.checkUserJWT, cartController.createCartItem);
   router.put('/update/quantity-cart-item/:id', jwtAction.checkUserJWT, cartController.updateQuantityCartItem);
   router.delete('/delete/cart-item/:id', jwtAction.checkUserJWT, cartController.deleteCartItem);

   // Order Routes
   router.post('/create/order', jwtAction.checkUserJWT, orderController.createOrder);
   router.put('/cancel/order/:id', jwtAction.checkUserJWT, orderController.cancelOrder);
   router.post('/create/feedback', jwtAction.checkUserJWT, feedbackController.createFeedback);

   // ADMIN ROUTES
   router.get('/read-all/users', jwtAction.checkUserJWT, userController.getAllUsers);
   router.post('/create/user', jwtAction.checkUserJWT, userController.createUser);
   router.put('/update/user/:id', jwtAction.checkUserJWT, userController.updateUser);
   router.delete('/delete/user/:id', jwtAction.checkUserJWT, userController.deleteUser);

   router.post('/create/product', jwtAction.checkUserJWT, upload.array('images', 10), productController.createProduct);
   router.put(
      '/update/product/:id',
      jwtAction.checkUserJWT,
      upload.array('images', 10),
      productController.updateProduct,
   );
   router.delete('/delete/product/:id', jwtAction.checkUserJWT, productController.deleteProduct);

   router.post(
      '/create/category',
      jwtAction.checkUserJWT,
      uploadCategory.single('image'),
      categoryController.createCategory,
   );
   router.put(
      '/update/category/:id',
      jwtAction.checkUserJWT,
      uploadCategory.single('image'),
      categoryController.updateCategory,
   );
   router.delete('/delete/category/:id', jwtAction.checkUserJWT, categoryController.deleteCategory);

   router.get('/read-all/orders', jwtAction.checkUserJWT, orderController.getAllOrders);
   router.put('/update/order-status/:id', jwtAction.checkUserJWT, orderController.updateOrderStatus);
   router.delete('/delete/order/:id', jwtAction.checkUserJWT, orderController.deleteOrder);

   router.get('/read-all/roles', jwtAction.checkUserJWT, roleController.getAllRoles);

   // Statistics
   router.get(
      '/statistics/detailed',
      jwtAction.checkUserJWT,
      jwtAction.checkUserPermission,
      statisticsController.getDetailedStats,
   );

   // Toggle User Status
   router.put(
      '/user/toggle-status/:id',
      jwtAction.checkUserJWT,
      jwtAction.checkUserPermission,
      userController.toggleUserStatus,
   );

   // Brand Admin Routes
   router.post('/create/brand', jwtAction.checkUserJWT, brandController.createBrand);
   router.put('/update/brand/:id', jwtAction.checkUserJWT, brandController.updateBrand);
   router.delete('/delete/brand/:id', jwtAction.checkUserJWT, brandController.deleteBrand);

   return app.use('/api/v1/', router);
};

export default initAPIRoutes;
