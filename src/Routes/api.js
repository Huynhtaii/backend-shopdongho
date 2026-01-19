import express from "express";
import userController from "../controller/userController";
import productController from "../controller/productController";
import categoryController from "../controller/categoryController";
const router = express.Router();

const initAPIRoutes = (app) => {
  // GET=>Read , POST =>Create , PUT => Update , DELETE=>Delete
  //API CỦA SẢN PHẨM
  router.get("/read-all/products", productController.getAllProducts); //lấy lên toàn bộ sản phẩm
  router.get("/recent-products", productController.getResentProducts); //lấy sản phẩm thuộc mảng arrId truyền vào
  router.get("/product/:id", productController.getProductById); //lấy lên sản phẩm theo id
  // lấy danh sách sản phẩm theo loại sản phẩm có limit và orderby create_at
  router.get("/read-product-by-categories/:name", productController.getProductByCategories)

  //Categories
  router.get("/read-all/categories", categoryController.getAllCategories);

  //lấy tất cả danh sách sản phẩm theo loại có phân trang
  router.get("/read-product-by-categories-with-pagination",productController.getProductByCategoriesWithPaginate )
 //API Của USER
 router.get("/read-all/user")
  return app.use("/api/v1/", router);
};

export default initAPIRoutes;
