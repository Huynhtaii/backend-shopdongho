import db from '../models';
const { Op } = require('sequelize');

const getAllProducts = async (limit, isAdmin = false) => {
   try {
      let where = {};
      if (!isAdmin) {
         where.status = 1;
      }

      let options = {
         where: where,
         include: [
            {
               model: db.ProductImage,
            },
            {
               model: db.Category,
            },
            {
               model: db.Brand,
               as: 'brand',
               attributes: ['brand_id', 'name', 'logo_url', 'country'],
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
            {
               model: db.Brand,
               as: 'brand',
               attributes: ['brand_id', 'name', 'logo_url', 'country'],
            },
            {
               model: db.Feedback,
               as: 'Feedbacks',
               include: [
                  {
                     model: db.User,
                     attributes: ['name'],
                  },
               ],
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
               where: { name: name, status: 1 },
               through: { attributes: [] },
            },
         ],
         where: { status: 1 },
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
      if (!Array.isArray(arrId)) {
         console.error('arrId không phải là một mảng hoặc bị undefined:', arrId);
         return {
            EM: 'Invalid input data',
            EC: '-1',
            DT: [],
         };
      }

      const products = await db.Product.findAll({
         include: [{ model: db.ProductImage }, { model: db.Category }],
      });

      const recentProduct = products.filter((product) => arrId.includes(String(product.product_id)));

      return {
         EM: 'Get product by categories success',
         EC: '0',
         DT: recentProduct,
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

const getProductByCategoriesWithPaginate = async (page, limit, categoryName, filter) => {
   try {
      let offset = (page - 1) * limit;

      // Điều kiện lọc theo category (nếu không phải "all")
      const catName = categoryName || 'all';
      const whereCategory = catName !== 'all' ? { name: catName } : {};

      // Điều kiện lọc sản phẩm
      let whereProduct = { status: 1 };

      if (filter?.price && filter.price !== 'all') {
         const priceS = filter.price.split('-');
         if (priceS.length === 2) {
            whereProduct.price = {
               [db.Sequelize.Op.between]: [parseInt(priceS[0]), parseInt(priceS[1])],
            };
         } else {
            // Trường hợp "Trên 20 triệu" (chỉ có 1 giá trị)
            whereProduct.price = {
               [db.Sequelize.Op.gte]: parseInt(priceS[0]),
            };
         }
      }

      if (filter?.rating && filter.rating !== 'all') {
         whereProduct.rating = {
            [db.Sequelize.Op.gte]: parseInt(filter.rating),
         };
      }

      const { count, rows } = await db.Product.findAndCountAll({
         where: whereProduct, // Áp dụng bộ lọc sản phẩm
         include: [
            {
               model: db.Category,
               where: { ...whereCategory, status: 1 },
               required: true,
            },
            {
               model: db.ProductImage,
            },
         ],
         limit: limit,
         offset: offset,
         distinct: true,
      });

      return {
         EM: 'Get all product successfully',
         EC: '0',
         DT: {
            totalRows: count,
            totalPages: Math.ceil(count / limit),
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
      // Tạo transaction để đảm bảo tính nhất quán của dữ liệu
      const result = await db.sequelize.transaction(async (t) => {
         // Tạo sản phẩm mới
         const newProduct = await db.Product.create(
            {
               name: product.name,
               description: product.description,
               price: product.price,
               discount_price: product.discount_price,
               rating: product.rating,
               created_at: product.created_at,
               brand_id: product.brand_id,
               sku: product.sku,
               origin: product.origin,
               target_audience: product.target_audience,
               product_line: product.product_line,
               water_resistance: product.water_resistance,
               movement_type: product.movement_type,
               glass_material: product.glass_material,
               strap_material: product.strap_material,
               case_size: product.case_size,
               case_thickness: product.case_thickness,
               utilities: product.utilities,
            },
            { transaction: t },
         );

         // Tạo bản ghi trong product_images
         if (product.imageUrls && product.imageUrls.length > 0) {
            for (const url of product.imageUrls) {
               await db.ProductImage.create(
                  {
                     url: url,
                     product_id: newProduct.product_id,
                  },
                  { transaction: t },
               );
            }
         }

         if (product.category_id) {
            await db.CategoriesHasProducts.create(
               {
                  categories_category_id: product.category_id,
                  products_product_id: newProduct.product_id,
               },
               { transaction: t },
            );
         }

         return newProduct;
      });

      return {
         EM: 'Create product successfully',
         EC: '0',
         DT: result,
      };
   } catch (error) {
      console.log('Error:', error);
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

      // Loại bỏ các trường mang giá trị undefined để tránh lỗi DB
      const updateData = { ...data };
      Object.keys(updateData).forEach((key) => {
         if (updateData[key] === undefined || updateData[key] === 'undefined' || updateData[key] === null) {
            delete updateData[key];
         }
      });

      // Cập nhật sản phẩm
      const result = await db.sequelize.transaction(async (t) => {
         const [affectedRows] = await db.Product.update(updateData, {
            where: { product_id: id },
            transaction: t,
         });

         // Xử lý cập nhật ảnh: chỉ xóa những ảnh KHÔNG có trong keptImageIds và thêm ảnh mới
         if (data.keptImageIds || (data.imageUrls && data.imageUrls.length > 0)) {
            // Nếu có danh sách giữ lại, xóa những ảnh không được giữ
            if (data.keptImageIds) {
               await db.ProductImage.destroy({
                  where: {
                     product_id: id,
                     product_image_id: { [Op.notIn]: data.keptImageIds },
                  },
                  transaction: t,
               });
            } else if (data.imageUrls && data.imageUrls.length > 0) {
               // Nếu không có danh sách giữ lại nhưng có ảnh mới (trường hợp cũ), xóa hết ảnh cũ
               await db.ProductImage.destroy({
                  where: { product_id: id },
                  transaction: t,
               });
            }

            // Thêm các ảnh mới nếu có
            if (data.imageUrls && data.imageUrls.length > 0) {
               for (const url of data.imageUrls) {
                  await db.ProductImage.create(
                     {
                        url: url,
                        product_id: id,
                     },
                     { transaction: t },
                  );
               }
            }
         }

         // Cập nhật category_id nếu hợp lệ
         if (updateData.category_id && !isNaN(updateData.category_id)) {
            await db.CategoriesHasProducts.update(
               { categories_category_id: updateData.category_id },
               {
                  where: { products_product_id: id },
                  transaction: t,
               },
            );
         }

         return affectedRows;
      });

      return {
         EM: 'Update product successfully',
         EC: '0',
         DT: result,
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
      const product = await db.Product.findByPk(id);
      if (!product) {
         return {
            EM: 'Product not found',
            EC: '0',
            DT: [],
         };
      }
      // Toggle status instead of destroying
      const newStatus = product.status === 1 ? 0 : 1;
      await product.update({ status: newStatus });

      return {
         EM: newStatus === 1 ? 'Show product successfully' : 'Hide product successfully',
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
const searchProduct = async (name) => {
   try {
      const products = await db.Product.findAll({
         where: {
            name: {
               [Op.like]: `%${name}%`,
            },
            status: 1,
         },
         include: [
            {
               model: db.ProductImage,
               attributes: ['url'],
            },
         ],
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
