import feedbackService from '../services/feedbackService';

const createFeedback = async (req, res) => {
   try {
      const data = req.body;
      if (req.files && req.files.length > 0) {
         data.image = req.files
            .map((file) => `${process.env.SERVER_URL}/uploads/product/${file.filename}`)
            .join(', ');
      } else {
         data.image = null;
      }
      const result = await feedbackService.createFeedback(data);
      return res.status(200).json({
         EM: result.EM,
         EC: result.EC,
         DT: result.DT,
      });
   } catch (error) {
      return res.status(500).json({
         EM: 'Lỗi từ server',
         EC: '-1',
         DT: '',
      });
   }
};
const getAllFeedbacks = async (req, res) => {
   try {
      const result = await feedbackService.getAllFeedbacks();
      return res.status(200).json({
         EM: result.EM,
         EC: result.EC,
         DT: result.DT,
      });
   } catch (error) {
      return res.status(500).json({ EM: 'Lỗi từ server', EC: '-1', DT: '' });
   }
};

const toggleFeedbackStatus = async (req, res) => {
   try {
      const id = req.params.id;
      const result = await feedbackService.toggleFeedbackStatus(id);
      return res.status(200).json({
         EM: result.EM,
         EC: result.EC,
         DT: result.DT,
      });
   } catch (error) {
      return res.status(500).json({ EM: 'Lỗi từ server', EC: '-1', DT: '' });
   }
};

const getFeedbacksByProductId = async (req, res) => {
   try {
      const { product_id } = req.params;
      const result = await feedbackService.getFeedbacksByProductId(product_id);
      return res.status(200).json({
         EM: result.EM,
         EC: result.EC,
         DT: result.DT,
      });
   } catch (error) {
      return res.status(500).json({ EM: 'Lỗi từ server', EC: '-1', DT: '' });
   }
};

export default { createFeedback, getAllFeedbacks, toggleFeedbackStatus, getFeedbacksByProductId };
