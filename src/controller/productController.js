import productService from '../services/productService';

const getAllProducts = async (req, res) => {
   const limit = req.query.limit;

   try {
      const isAdmin = req.query.isAdmin === 'true';
      let products = await productService.getAllProducts(limit, isAdmin);
      return res.status(200).json({
         EM: products.EM,
         EC: products.EC,
         DT: products.DT,
      });
   } catch (error) {
      return res.status(500).json({
         EM: 'error from server',
         EC: '-1',
         DT: '',
      });
   }
};
const getProductById = async (req, res) => {
   try {
      const { id } = req.params;
      const isAdmin = req.query.isAdmin === 'true';
      const product = await productService.getProductById(id, isAdmin);
      return res.status(200).json({
         EM: product.EM,
         EC: product.EC,
         DT: product.DT,
      });
   } catch (error) {
      return res.status(500).json({
         EM: 'error from server',
         EC: '-1',
         DT: '',
      });
   }
};
const getProductByCategories = async (req, res) => {
   try {
      const { name } = req.params;
      const isAdmin = req.query.isAdmin === 'true';
      const products = await productService.getProductByCategories(name, isAdmin);
      return res.status(200).json({
         EM: products.EM,
         EC: products.EC,
         DT: products.DT,
      });
   } catch (error) {
      return res.status(500).json({
         EM: 'error from server',
         EC: '-1',
         DT: '',
      });
   }
};

const getResentProducts = async (req, res) => {
   try {
      const arrId = req.query.arrId;
      const isAdmin = req.query.isAdmin === 'true';

      const recentProducts = await productService.getResentProducts(arrId || [], isAdmin);
      return res.status(200).json({
         EM: recentProducts.EM,
         EC: recentProducts.EC,
         DT: recentProducts.DT,
      });
   } catch (error) {
      return res.status(500).json({
         EM: 'error from server',
         EC: '-1',
         DT: '',
      });
   }
};

const getProductByCategoriesWithPaginate = async (req, res) => {
   try {
      const page = req.query.page;
      const limit = req.query.limit;
      const categoryName = req.query.categoryName;
      const filter = req.query.filter;
      const isAdmin = req.query.isAdmin === 'true';

      if (page && limit) {
         let data = await productService.getProductByCategoriesWithPaginate(+page, +limit, categoryName, filter, isAdmin);
         return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
         });
      }
      return res.status(500).json({
         EM: 'You have not yet transmitted to the page value',
         EC: '-1',
         DT: '',
      });
   } catch (error) {
      return res.status(500).json({
         EM: 'error from server',
         EC: '-1',
         DT: '',
      });
   }
};
const createProduct = async (req, res) => {
   try {
      const product = req.body;
      // Nếu có file ảnh, tạo URL và thêm vào product
      if (req.files && req.files.length > 0) {
         const imageUrls = req.files.map((file) => `${process.env.SERVER_URL}/uploads/product/${file.filename}`);
         product.imageUrls = imageUrls;
      } else {
         return res.status(400).json({
            EM: 'Vui lòng upload ảnh sản phẩm!',
            EC: '-1',
            DT: '',
         });
      }

      // Chuyển đổi các giá trị từ string sang số nếu cần
      product.price = parseFloat(product.price);
      product.discount_price = parseFloat(product.discount_price);
      product.rating = parseInt(product.rating);
      product.brand_id = parseInt(product.brand_id);
      product.stock = parseInt(product.stock);

      // Gọi service để tạo sản phẩm
      const data = await productService.createProduct(product);

      return res.status(200).json({
         EM: data.EM,
         EC: data.EC,
         DT: {
            product: data.DT,
            imageUrls: product.imageUrls,
         },
      });
   } catch (error) {
      console.error('Create product error:', error);
      return res.status(500).json({
         EM: 'error from server',
         EC: '-1',
         DT: '',
      });
   }
};
const updateProduct = async (req, res) => {
   try {
      const { id } = req.params;
      const product = req.body;

      // Chuyển đổi các giá trị từ string sang số nếu có
      if (product.price) product.price = parseFloat(product.price);
      if (product.discount_price) product.discount_price = parseFloat(product.discount_price);
      if (product.rating) product.rating = parseInt(product.rating);
      if (product.brand_id) product.brand_id = parseInt(product.brand_id);
      if (product.category_id) product.category_id = parseInt(product.category_id);
      if (product.stock) product.stock = parseInt(product.stock);
      if (product.keptImageIds) {
         try {
            product.keptImageIds = JSON.parse(product.keptImageIds);
         } catch (e) {
            product.keptImageIds = [];
         }
      }

      // Nếu có file ảnh, tạo URL và thêm vào product
      if (req.files && req.files.length > 0) {
         const imageUrls = req.files.map((file) => `${process.env.SERVER_URL}/uploads/product/${file.filename}`);
         product.imageUrls = imageUrls;
      }

      const data = await productService.updateProduct(id, product);
      return res.status(200).json({
         EM: data.EM,
         EC: data.EC,
         DT: data.DT,
      });
   } catch (error) {
      return res.status(500).json({
         EM: 'error from server',
         EC: '-1',
         DT: '',
      });
   }
};
const deleteProduct = async (req, res) => {
   try {
      const { id } = req.params;
      const data = await productService.deleteProduct(id);
      return res.status(200).json({
         EM: data.EM,
         EC: data.EC,
         DT: data.DT,
      });
   } catch (error) {
      return res.status(500).json({
         EM: 'error from server',
         EC: '-1',
         DT: '',
      });
   }
};
const searchProduct = async (req, res) => {
   try {
      const { name, isAdmin } = req.query;
      const isAdminFlag = isAdmin === 'true';

      if (!name) {
         return res.status(400).json({
            EM: 'Missing search keyword',
            EC: '1',
            DT: [],
         });
      }

      const products = await productService.searchProduct(name, isAdminFlag);

      return res.status(200).json({
         EM: 'Search successful',
         EC: '0',
         DT: products.DT,
      });
   } catch (error) {
      console.log(error);
      return res.status(500).json({
         EM: 'Error from server',
         EC: '-1',
         DT: '',
      });
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
