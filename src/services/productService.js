import { where } from 'sequelize';
import db from '../models';
import { name } from 'ejs';
const getAllProducts = async (limit) => {
   try {
      let options = {
         include: [
            {
               model: db.ProductImage,
            },
            {
               model: db.Category,
            },
         ],
      };

      if (limit) {
         options.limit = parseInt(limit);
      }

      const products = await db.Product.findAll(options);

      if (!products) {
         return {
            EM: 'product not found',
            EC: '0',
            DT: [],
         };
      }
      return {
         EM: 'Get list product success',
         EC: '0',
         DT: products,
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

const getProductById = async (id) => {
   try {
      const product = await db.Product.findByPk(id, {
         include: [
            {
               model: db.ProductImage,
            },
            {
               model: db.Category,
            },
         ],
      });
      if (!product) {
         return {
            EM: 'product not found',
            EC: '0',
            DT: [],
         };
      }
      return {
         EM: 'Get product success',
         EC: '0',
         DT: product,
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
const getProductByCategories = async (name) => {
   try {
      const products = await db.Product.findAll({
         include: [
            {
               model: db.ProductImage,
            },
            {
               model: db.Category,
               where: { name: name },
               through: { attributes: [] },
            },
         ],
         limit: 10,
         order: [['created_at', 'DESC']],
      });
      if (!products) {
         return {
            EM: 'product not found',
            EC: '0',
            DT: [],
         };
      }
      return {
         EM: 'Get product by categories success',
         EC: '0',
         DT: products,
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

const getResentProducts = async (arrId) => {
   try {
      const products = await db.Product.findAll({
         include: [
            {
               model: db.ProductImage,
            },
            {
               model: db.Category,
            },
         ],
      });

      const recentProduct = products.filter((product) => {
         return arrId.includes(product.product_id + '');
      });

      if (!recentProduct) {
         return {
            EM: 'product not found',
            EC: '0',
            DT: [],
         };
      }
      return {
         EM: 'Get product by categories success',
         EC: '0',
         DT: recentProduct,
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

const getProductByCategoriesWithPaginate = async (page, limit, categoryName, filter) => {
   try {
      let offset = (page - 1) * limit;

      // Điều kiện lọc theo category (nếu không phải "all")
      const whereCategory = categoryName !== "all" ? { name: categoryName } : {};

      // Điều kiện lọc sản phẩm
      let whereProduct = {};

      if (filter?.price !== "all") {
         const priceS = filter.price.split('-')
         whereProduct.price = {
            [db.Sequelize.Op.between]: [priceS[0], priceS[1]], // Lọc theo khoảng giá
         };
      }

      if (filter?.rating !== "all") {
         whereProduct.rating = {
            [db.Sequelize.Op.eq]: parseInt(filter.rating), // Lọc sản phẩm có rating >= filter.rating
         };
      }

      const { rows } = await db.Product.findAndCountAll({
         where: whereProduct, // Áp dụng bộ lọc sản phẩm
         include: [
            {
               model: db.Category,
               where: whereCategory,
               required: categoryName !== "all",
            },
            {
               model: db.ProductImage,
            }
         ],
         limit: limit,
         offset: offset,
      });

      return {
         EM: 'Get all product successfully',
         EC: 0,
         DT: {
            totalRows: rows.length,
            totalPages: Math.ceil(rows.length / limit),
            product: rows,
         },
      };
   } catch (error) {
      console.error(error);
      return {
         EM: 'error from service',
         EC: '-1',
         DT: '',
      };
   }
};

const createProduct = async (product) => {
   try {
      const newProduct = await db.Product.create(product);
      return {
         EM: 'Create product successfully',
         EC: 0,
         DT: newProduct,
      };
   } catch (error) {
      return {
         EM: 'error from service',
         EC: '-1',
         DT: '',
      };
   }
};
const updateProduct = async (id, data) => {
   try {
      // Tìm product hiện có dựa theo id
      const productUpdate = await db.Product.findOne({
         where: { product_id: id },
      });

      if (!productUpdate) {
         return {
            EM: 'Product not found',
            EC: '0',
            DT: [],
         };
      }

      // Kiểm tra nếu dữ liệu gửi lên giống với dữ liệu hiện có
      let nothingToUpdate = true;
      for (const key in data) {
         // Nếu key là những trường cần ép kiểu
         if (key === 'price' || key === 'discount_price') {
            if (Number(productUpdate[key]) !== Number(data[key])) {
               nothingToUpdate = false;
               break;
            }
         } else if (key === 'created_at') {
            if (new Date(productUpdate[key]).toISOString() !== new Date(data[key]).toISOString()) {
               nothingToUpdate = false;
               break;
            }
         } else {
            if (productUpdate[key] !== data[key]) {
               nothingToUpdate = false;
               break;
            }
         }
      }

      if (nothingToUpdate) {
         return {
            EM: 'Nothing to update',
            EC: '0',
            DT: productUpdate,
         };
      }

      // Cập nhật sản phẩm
      const [affectedRows] = await db.Product.update(data, {
         where: { product_id: id },
      });

      return {
         EM: 'Update product successfully',
         EC: '0',
         DT: affectedRows,
      };
   } catch (error) {
      console.log(error);
      return {
         EM: 'Error from service',
         EC: '-1',
         DT: '',
      };
   }
};
const deleteProduct = async (id) => {
   try {
      const product = await db.Product.destroy({
         where: { product_id: id },
      });
      if (!product) {
         return {
            EM: 'Product not found',
            EC: '0',
            DT: [],
         };
      }
      return {
         EM: 'Delete product successfully',
         EC: 0,
         DT: product,
      };
   } catch (error) {
      return {
         EM: 'error from service',
         EC: '-1',
         DT: '',
      };
   }
};
const searchProduct = async (name) => {
   try {
      const products = await db.Product.findAll({
         where: {
            name: {
               [db.Sequelize.Op.like]: `%${name}%`,
            },
         },
      });

      if (products.length === 0) {
         return {
            EM: 'No products found',
            EC: '0',
            DT: [],
         };
      }

      return {
         EM: 'Search successful',
         EC: '0',
         DT: products,
      };
   } catch (error) {
      console.log(error);
      return {
         EM: 'Error from service',
         EC: '-1',
         DT: '',
      };
   }
};

export default {
   getAllProducts,
   getProductById,
   getProductByCategories,
   getProductByCategoriesWithPaginate,
   getResentProducts,
   createProduct,
   updateProduct,
   deleteProduct,
   searchProduct,
};
