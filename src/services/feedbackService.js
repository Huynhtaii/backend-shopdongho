import db from '../models';

const createFeedback = async (data) => {
   try {
      const { rating, comments, image, product_id, user_id, order_id } = data;

      const feedback = await db.Feedback.create({
         rating,
         comments: comments || '',
         image: typeof image === 'string' ? image : null,
         product_id,
         user_id,
         order_id: order_id || null,
         created_at: new Date(),
         is_resolved: 0,
      });

      if (!feedback) {
         return { EM: 'Tạo đánh giá thất bại', EC: '-1', DT: '' };
      }

      // Tính lại rating trung bình và review_count cho sản phẩm
      const allFeedbacks = await db.Feedback.findAll({
         where: { product_id },
         attributes: ['rating'],
      });

      const review_count = allFeedbacks.length;
      const avgRating = Math.round(allFeedbacks.reduce((sum, fb) => sum + fb.rating, 0) / review_count);

      await db.Product.update({ rating: avgRating, review_count }, { where: { product_id } });

      return {
         EM: 'Đánh giá thành công',
         EC: '0',
         DT: { feedback, avgRating, review_count },
      };
   } catch (error) {
      console.log(error);
      return { EM: 'Lỗi từ service tạo đánh giá', EC: '-1', DT: '' };
   }
};
const getAllFeedbacks = async () => {
   try {
      const feedbacks = await db.Feedback.findAll({
         include: [
            {
               model: db.User,
               attributes: ['name', 'email', 'user_id'],
            },
            {
               model: db.Product,
               attributes: ['name', 'product_id'],
               include: [{ model: db.ProductImage, attributes: ['url'] }],
            },
         ],
         order: [['created_at', 'DESC']],
      });

      return {
         EM: 'Get all feedbacks successfully',
         EC: '0',
         DT: feedbacks,
      };
   } catch (error) {
      console.log(error);
      return { EM: 'Error from service get feedbacks', EC: '-1', DT: [] };
   }
};

const toggleFeedbackStatus = async (id) => {
   try {
      const feedback = await db.Feedback.findByPk(id);
      if (!feedback) {
         return { EM: 'Feedback not found', EC: '1', DT: '' };
      }

      feedback.is_resolved = feedback.is_resolved === 1 ? 0 : 1;
      await feedback.save();

      return {
         EM: feedback.is_resolved === 1 ? 'Đã ẩn đánh giá' : 'Đã hiện đánh giá',
         EC: '0',
         DT: feedback,
      };
   } catch (error) {
      console.log(error);
      return { EM: 'Error from service toggle feedback', EC: '-1', DT: '' };
   }
};

const getFeedbacksByProductId = async (product_id) => {
   try {
      const feedbacks = await db.Feedback.findAll({
         where: { product_id },
         include: [
            {
               model: db.User,
               attributes: ['name', 'email', 'user_id'],
            },
         ],
         order: [['created_at', 'DESC']],
      });

      return {
         EM: 'Get feedbacks by product success',
         EC: '0',
         DT: feedbacks,
      };
   } catch (error) {
      console.log(error);
      return { EM: 'Error from service get feedbacks by product', EC: '-1', DT: [] };
   }
};

export default { createFeedback, getAllFeedbacks, toggleFeedbackStatus, getFeedbacksByProductId };
