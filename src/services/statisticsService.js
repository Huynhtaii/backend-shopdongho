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
      const rawRevenueStats = await db.Order.findAll({
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

      let revenueStats = rawRevenueStats;

      // FILL GAPS for daily view
      if (type === 'day') {
         revenueStats = [];
         for (let i = 0; i <= 30; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            const d = date.getDate();
            const m = date.getMonth() + 1;
            const y = date.getFullYear();

            const found = rawRevenueStats.find((s) => s.day === d && s.month === m && s.year === y);
            revenueStats.push({
               day: d,
               month: m,
               year: y,
               revenue: found ? parseFloat(found.revenue) : 0,
            });
         }
      } else {
         // Ensure number format for other types
         revenueStats = rawRevenueStats.map((s) => ({
            ...s,
            revenue: parseFloat(s.revenue) || 0,
         }));
      }

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
         attributes: ['product_id', [fn('AVG', col('Feedback.rating')), 'avgRating']],
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

      // 6. Total Overall Revenue
      const totalOverallRevenueResult = await db.Order.findAll({
         where: { status: 'Completed' },
         attributes: [[fn('SUM', col('total_amount')), 'total']],
         raw: true,
      });
      const totalOverallRevenue = totalOverallRevenueResult[0]?.total || 0;

      // 7. Total Completed Orders
      const totalCompletedOrders = await db.Order.count({
         where: { status: 'Completed' },
      });

      return {
         EM: 'Get statistics success',
         EC: '0',
         DT: {
            revenueStats,
            type,
            totalOverallRevenue,
            totalCompletedOrders,
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
