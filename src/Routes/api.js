import express from 'express';
import userController from '../controller/userController';
import productController from '../controller/productController';
import categoryController from '../controller/categoryController';
import orderController from '../controller/orderController';
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
   router.post('/create/product', productController.createProduct);
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
   router.delete('/delete/order/:id', orderController.deleteOrder);

   //api search product
   router.get('/product-search', productController.searchProduct);
   return app.use('/api/v1/', router);
};

export default initAPIRoutes;
