import productService from "../services/productService";

const getAllProducts = async (req, res) => {
  try {
    let products = await productService.getAllProducts();
    return res.status(200).json({
      EM: products.EM,
      EC: products.EC,
      DT: products.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    return res.status(200).json({
      EM: product.EM,
      EC: product.EC,
      DT: product.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

export default { getAllProducts, getProductById };
