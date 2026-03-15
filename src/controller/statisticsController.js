import statisticsService from '../services/statisticsService';

const getDetailedStats = async (req, res) => {
   try {
      const data = await statisticsService.getDetailedStats(req.query);
      return res.status(200).json({
         EM: data.EM,
         EC: data.EC,
         DT: data.DT,
      });
   } catch (error) {
      console.error('Error at getDetailedStats:', error);
      return res.status(500).json({
         EM: 'Internal server error',
         EC: '-1',
         DT: '',
      });
   }
};

export default {
   getDetailedStats,
};
