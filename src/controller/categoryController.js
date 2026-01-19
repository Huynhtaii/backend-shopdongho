import categoryService from "../services/categoryService";

const getAllCategories = async (req, res) => {
  try {
    let categories = await categoryService.getCatgeories();
    return res.status(200).json({
      EM: categories.EM,
      EC: categories.EC,
      DT: categories.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};
export default { getAllCategories };
