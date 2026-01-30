import categoryService from '../services/categoryService';

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
         EM: 'error from server',
         EC: '-1',
         DT: '',
      });
   }
};
const getCategoryById = async (req, res) => {
   try {
      const { id } = req.params;
      let category = await categoryService.getCategoryById(id);
      return res.status(200).json({
         EM: category.EM,
         EC: category.EC,
         DT: category.DT,
      });
   } catch (error) {
      return res.status(500).json({
         EM: 'error from server',
         EC: '-1',
         DT: '',
      });
   }
};
const createCategory = async (req, res) => {
   try {
      const { name, description, image } = req.body;
      let category = await categoryService.createCategory({ name, description, image });
      return res.status(200).json({
         EM: category.EM,
         EC: category.EC,
         DT: category.DT,
      });
   } catch (error) {
      return res.status(500).json({
         EM: 'error from server',
         EC: '-1',
         DT: '',
      });
   }
};
const updateCategory = async (req, res) => {
   try {
      const { id } = req.params;
      const { name, description, image } = req.body;
      let category = await categoryService.updateCategory(id, { name, description, image });
      return res.status(200).json({
         EM: category.EM,
         EC: category.EC,
         DT: category.DT,
      });
   } catch (error) {
      return res.status(500).json({
         EM: 'error from server',
         EC: '-1',
         DT: '',
      });
   }
};
const deleteCategory = async (req, res) => {
   try {
      const { id } = req.params;
      let category = await categoryService.deleteCategory(id);
      return res.status(200).json({
         EM: category.EM,
         EC: category.EC,
         DT: category.DT,
      });
   } catch (error) {
      return res.status(500).json({
         EM: 'error from server',
         EC: '-1',
         DT: '',
      });
   }
};
export default { getAllCategories, getCategoryById, getCategoryById, createCategory, updateCategory, deleteCategory };
