import express from "express";
import userController from "../controller/userController";
import productController from "../controller/productController";
const router = express.Router();

const initAPIRoutes = (app) => {
  // GET=>Read , POST =>Create , PUT => Update , DELETE=>Delete
  //API CỦA SẢN PHẨM
  router.get("/read-all/products", productController.getAllProducts); //lấy lên toàn bộ sản phẩm
  router.get("/product/:id", productController.getProductById); //lấy lên sản phẩm theo id
  
 //API CỦA USER
 router.get("/read-all/user")
  return app.use("/api/v1/", router);
};

export default initAPIRoutes;
