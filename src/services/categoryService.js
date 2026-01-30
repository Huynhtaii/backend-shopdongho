import db from '../models';
const getCatgeories = async () => {
   try {
      const categories = await db.Category.findAll();
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
      const category = await db.Category.destroy({
         where: { category_id: id },
      });
      if (!category) {
         return {
            EM: 'category not found',
            EC: '0',
            DT: [],
         };
      }
      return {
         EM: 'delete category success',
         EC: 0,
         DT: category,
      };
   } catch (error) {
      return {
         EM: 'error from service',
         EC: '-1',
         DT: '',
      };
   }
};
export default { getCatgeories, getCategoryById, createCategory, updateCategory, deleteCategory };
