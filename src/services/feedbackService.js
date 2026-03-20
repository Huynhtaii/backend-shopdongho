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

export default { createFeedback };
