import brandService from '../services/brandService';

const getAllBrands = async (req, res) => {
   try {
      const isAdmin = req.query.isAdmin === 'true';
      const data = await brandService.getAllBrands(isAdmin);
      return res.status(200).json(data);
   } catch (error) {
      return res.status(500).json({ EM: 'error from server', EC: '-1', DT: [] });
   }
};

const getBrandById = async (req, res) => {
   try {
      const data = await brandService.getBrandById(req.params.id);
      return res.status(200).json(data);
   } catch (error) {
      return res.status(500).json({ EM: 'error from server', EC: '-1', DT: null });
   }
};

const createBrand = async (req, res) => {
   try {
      const data = await brandService.createBrand(req.body);
      return res.status(201).json(data);
   } catch (error) {
      return res.status(500).json({ EM: 'error from server', EC: '-1', DT: null });
   }
};

const updateBrand = async (req, res) => {
   try {
      const data = await brandService.updateBrand(req.params.id, req.body);
      return res.status(200).json(data);
   } catch (error) {
      return res.status(500).json({ EM: 'error from server', EC: '-1', DT: null });
   }
};

const deleteBrand = async (req, res) => {
   try {
      const data = await brandService.deleteBrand(req.params.id);
      return res.status(200).json(data);
   } catch (error) {
      return res.status(500).json({ EM: 'error from server', EC: '-1', DT: null });
   }
};

export default { getAllBrands, getBrandById, createBrand, updateBrand, deleteBrand };
