import db from '../models/index';
import { Op, fn, col, literal } from 'sequelize';

const getDetailedStats = async (query = {}) => {
   try {
      const { type = 'month' } = query;
      const now = new Date();
      let startDate;
      let attributes = [];
      let group = [];
      let order = [];

      if (type === 'day') {
         startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
         attributes = [
            [fn('DAY', col('order_date')), 'day'],
            [fn('MONTH', col('order_date')), 'month'],
            [fn('YEAR', col('order_date')), 'year'],
            [fn('SUM', col('total_amount')), 'revenue'],
         ];
         group = [literal('year'), literal('month'), literal('day')];
         order = [
            [literal('year'), 'ASC'],
            [literal('month'), 'ASC'],
            [literal('day'), 'ASC'],
         ];
      } else if (type === 'year') {
         startDate = new Date(now.getFullYear() - 5, 0, 1);
         attributes = [
            [fn('YEAR', col('order_date')), 'year'],
            [fn('SUM', col('total_amount')), 'revenue'],
         ];
         group = [literal('year')];
         order = [[literal('year'), 'ASC']];
      } else {
         // Default: month
         startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
         attributes = [
            [fn('MONTH', col('order_date')), 'month'],
            [fn('YEAR', col('order_date')), 'year'],
            [fn('SUM', col('total_amount')), 'revenue'],
         ];
         group = [literal('year'), literal('month')];
         order = [
            [literal('year'), 'ASC'],
            [literal('month'), 'ASC'],
         ];
      }

      // 1. Revenue Stats
      const revenueStats = await db.Order.findAll({
         where: {
            status: 'Completed',
            order_date: {
               [Op.gte]: startDate,
            },
         },
         attributes,
         group,
         order,
         raw: true,
      });

      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const newUsersCount = await db.User.count({
         where: {
            created_at: {
               [Op.gte]: firstDayOfMonth,
            },
         },
      });

      // 3. Feedback Stats
      const feedbacks = await db.Feedback.findAll({
         attributes: [
            [fn('AVG', col('Feedback.rating')), 'avgRating'],
            [fn('COUNT', col('feedback_id')), 'totalFeedback'],
         ],
         raw: true,
      });

      // 4. Product Ratings (Top 5 and Bottom 5)
      const productRatings = await db.Feedback.findAll({
         attributes: [
            'product_id',
            [fn('AVG', col('Feedback.rating')), 'avgRating'],
         ],
         include: [
            {
               model: db.Product,
               attributes: ['name'],
            },
         ],
         group: ['product_id', 'Product.product_id'],
         order: [[literal('avgRating'), 'DESC']],
         raw: true,
         nest: true,
      });

      const topRated = productRatings.slice(0, 5);
      const bottomRated = [...productRatings].reverse().slice(0, 5);

      // 5. Detailed Sales per Product
      const productSales = await db.OrderItem.findAll({
         attributes: [
            'product_id',
            [fn('SUM', col('OrderItem.quantity')), 'totalSold'],
            [fn('SUM', literal('OrderItem.quantity * OrderItem.price')), 'revenue'],
         ],
         include: [
            {
               model: db.Product,
               attributes: ['name'],
            },
         ],
         group: ['product_id', 'Product.product_id'],
         order: [[literal('revenue'), 'DESC']],
         raw: true,
         nest: true,
      });

      return {
         EM: 'Get statistics success',
         EC: '0',
         DT: {
            revenueStats,
            type,
            newUsersThisMonth: newUsersCount,
            feedbackStats: feedbacks[0] || { avgRating: 0, totalFeedback: 0 },
            topRated,
            bottomRated,
            productSales,
         },
      };
   } catch (error) {
      console.error('Error in statisticsService:', error);
      return {
         EM: 'Error getting statistics',
         EC: '1',
         DT: null,
      };
   }
};

export default {
   getDetailedStats,
};
