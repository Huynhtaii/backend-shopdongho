import categoryService from '../services/categoryService';

const getAllCategories = async (req, res) => {
   try {
      const isAdmin = req.query.isAdmin === 'true';
      let categories = await categoryService.getCatgeories(isAdmin);
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
      const { name, description } = req.body;
      const image = req.file ? `${process.env.SERVER_URL}/uploads/category/${req.file.filename}` : req.body.image || '';
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
      const { name, description } = req.body;
      const image = req.file
         ? `${req.protocol}://${req.get('host')}/uploads/category/${req.file.filename}`
         : req.body.image || undefined;
      const data = { name, description };
      if (image !== undefined) data.image = image;
      let category = await categoryService.updateCategory(id, data);
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
