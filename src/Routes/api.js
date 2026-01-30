import express from 'express';
import userController from '../controller/userController';
import productController from '../controller/productController';
import categoryController from '../controller/categoryController';
import orderController from '../controller/orderController';
import { upload } from '../middleware/uploadImage';
import roleCotroller from '../controller/roleController';
import loginRegisterController from '../controller/loginRegisterController';
import cartController from '../controller/cartController';
import jwtAction from '../middleware/jwtAction';
const router = express.Router();

const initAPIRoutes = (app) => {
   // GET=>Read , POST =>Create , PUT => Update , DELETE=>Delete
   //API CỦA Người dùng
   router.get('/read-all/products', productController.getAllProducts); //lấy lên toàn bộ sản phẩm
   router.get('/recent-products', productController.getResentProducts); //lấy sản phẩm thuộc mảng arrId truyền vào
   router.get('/product/:id', productController.getProductById); //lấy lên sản phẩm theo id
   // lấy danh sách sản phẩm theo loại sản phẩm có limit và orderby create_at
   router.get('/read-product-by-categories/:name', productController.getProductByCategories);

   //Categories
   router.get('/read-all/categories', categoryController.getAllCategories);

   //lấy tất cả danh sách sản phẩm theo loại có phân trang
   router.get('/read-product-by-categories-with-pagination', productController.getProductByCategoriesWithPaginate);

   //API CỦA Admin FindAll, findOne, Create, Update, Delete  cho 4 bảng User, Product, Category, Order
   //API CỦA USER
   router.get('/read-all/users', userController.getAllUsers);
   router.get('/read/user/:id', userController.getUserById);
   router.post('/create/user', userController.createUser);
   router.put('/update/user/:id', userController.updateUser);
   router.delete('/delete/user/:id', userController.deleteUser);
   //API CỦA PRODUCT
   //  router.get('/read-all/products', productController.getAllProducts); đã có
   // router.get('/product/:id', productController.getProductById); lấy lên sản phẩm theo id
   router.post('/create/product', upload.single('images'), productController.createProduct);
   router.put('/update/product/:id', productController.updateProduct);
   router.delete('/delete/product/:id', productController.deleteProduct);
   //API CỦA CATEGORY
   // router.get('/read-all/categories', categoryController.getAllCategories); đã có
   router.get('/category/:id', categoryController.getCategoryById);
   router.post('/create/category', categoryController.createCategory);
   router.put('/update/category/:id', categoryController.updateCategory);
   router.delete('/delete/category/:id', categoryController.deleteCategory);
   //API CỦA ORDER
   router.get('/read-all/orders', orderController.getAllOrders);
   router.get('/order/:id', orderController.getOrderById);
   router.post('/create/order', orderController.createOrder);
   router.put('/update/order/:id', orderController.updateOrder);
   router.put('/update/order-status/:id', orderController.updateOrderStatus);
   router.delete('/delete/order/:id', orderController.deleteOrder);
   //API CỦA ROLE
   router.get('/read-all/roles', roleCotroller.getAllRoles);
   //API search product
   router.get('/product-search', productController.searchProduct);

   //API Đăng Ký
   router.post('/register', loginRegisterController.handleRegister);
   //API ĐĂNG NHẬP
   router.post('/login', loginRegisterController.handleLogin);
   //API LẤY THÔNG TIN ACCOUNT (cần JWT token)
   router.get('/account', jwtAction.checkUserJWT, loginRegisterController.getAccount);
   //API LẤY THÔNG TIN tài khoản NGƯỜI DÙNG
   router.get('/read/account-user/:id', loginRegisterController.getInforAccount);
   //update tài khoản người dùng
   router.put('/update/account-user/:id', loginRegisterController.updateInforAccount);


   //API Giỏ hàng
   router.get('/read/cart/:user_id', cartController.getCartByUserId);
   router.post('/create/cart-item/:user_id', cartController.createCartItem);
   router.put('/update/quantity-cart-item/:id', cartController.updateQuantityCartItem);
   router.delete('/delete/cart-item/:id',cartController.deleteCartItem)

   return app.use('/api/v1/', router);
};

export default initAPIRoutes;
