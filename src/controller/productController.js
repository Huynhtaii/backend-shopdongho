import productService from "../services/productService";

const getAllProducts = async (req, res) => {
  const limit = req.query.limit;

  try {
    let products = await productService.getAllProducts(limit);
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
const getProductByCategories = async (req, res) => {
  try {
    const { name } = req.params;
    const products = await productService.getProductByCategories(name);
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

const getResentProducts = async (req, res) => {
  try {
    const arrId = req.query.arrId;

    const recentProducts = await productService.getResentProducts(arrId);
    return res.status(200).json({
      EM: recentProducts.EM,
      EC: recentProducts.EC,
      DT: recentProducts.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

const getProductByCategoriesWithPaginate = async (req, res) => {
  try {
    const page = req.query.page;
    const limit = req.query.limit;
    if (page && limit) {
      let data = await productService.getProductByCategoriesWithPaginate(+page, +limit);
      console.log(">>>>check data", data.DT)
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    }
    return res.status(500).json({
      EM: "You have not yet transmitted to the page value",
      EC: "-1",
      DT: "",
    });
  } catch (error) {
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
}
export default { getAllProducts, getProductById, getProductByCategories, getProductByCategoriesWithPaginate, getResentProducts };
