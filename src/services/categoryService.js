import db from '../models';
const getCatgeories = async (isAdmin = false) => {
   try {
      let where = {};
      if (!isAdmin) {
         where.status = 1;
      }
      const categories = await db.Category.findAll({
         where: where,
         include: [{ model: db.Product, attributes: ['product_id'] }],
      });
      if (!categories) {
         return {
            EM: 'categories not found',
            EC: '0',
            DT: [],
         };
      }
      return {
         EM: 'Get categories success',
         EC: '0',
         DT: categories,
      };
   } catch (error) {
      console.log(error);
      return {
         EM: 'error from service',
         EC: '-1',
         DT: '',
      };
   }
};
const getCategoryById = async (id) => {
   try {
      const category = await db.Category.findByPk(id);
      if (!category) {
         return {
            EM: 'category not found',
            EC: '0',
            DT: [],
         };
      }
      return {
         EM: 'Get category success',
         EC: '0',
         DT: category,
      };
   } catch (error) {
      console.log(error);
      return {
         EM: 'error from service',
         EC: '-1',
         DT: '',
      };
   }
};
const createCategory = async (data) => {
   try {
      const category = await db.Category.create(data);
      if (!category) {
         return {
            EM: 'create category fail',
            EC: '0',
            DT: [],
         };
      }
      return {
         EM: 'create category success',
         EC: '0',
         DT: category,
      };
   } catch (error) {
      console.log(error);
      return {
         EM: 'error from service create category',
         EC: '-1',
         DT: '',
      };
   }
};
const updateCategory = async (id, data) => {
   try {
      const category = await db.Category.findByPk(id);
      if (!category) {
         return {
            EM: 'category not found',
            EC: '0',
            DT: [],
         };
      }

      // Check if there are any changes
      let nothingToUpdate = true;
      for (const key in data) {
         if (category[key] !== data[key]) {
            nothingToUpdate = false;
            break;
         }
      }

      if (nothingToUpdate) {
         return {
            EM: 'Nothing to update',
            EC: '0',
            DT: category,
         };
      }

      await category.update(data);
      return {
         EM: 'update category success',
         EC: '0',
         DT: category,
      };
   } catch (error) {
      console.log(error);
      return {
         EM: 'error from service update category',
         EC: '-1',
         DT: '',
      };
   }
};
const deleteCategory = async (id) => {
   try {
      const category = await db.Category.findByPk(id);
      if (!category) {
         return {
            EM: 'category not found',
            EC: '0',
            DT: [],
         };
      }
      const newStatus = category.status === 1 ? 0 : 1;
      await category.update({ status: newStatus });
      return {
         EM: newStatus === 1 ? 'Show category successfully' : 'Hide category successfully',
         EC: '0',
         DT: category,
      };
   } catch (error) {
      console.log(error);
      return {
         EM: 'error from service',
         EC: '-1',
         DT: '',
      };
   }
};
export default { getCatgeories, getCategoryById, createCategory, updateCategory, deleteCategory };
