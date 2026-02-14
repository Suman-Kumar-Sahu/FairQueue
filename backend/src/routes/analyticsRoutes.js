import express from 'express';
import {getCenterAnalytics,getPeakHours,getLoadTrends,getOverallStats} from '../controllers/analyticsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/overall', authorize('admin'), getOverallStats);
router.get('/center/:centerId', authorize('admin', 'staff'), getCenterAnalytics);
router.get('/center/:centerId/peak-hours', authorize('admin', 'staff'), getPeakHours);
router.get('/center/:centerId/load-trends', authorize('admin', 'staff'), getLoadTrends);

export default router;
