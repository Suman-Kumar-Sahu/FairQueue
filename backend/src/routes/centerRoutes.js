import express from 'express';
import {getCenters,getCenter,createCenter,updateCenter,deleteCenter,getCentersInRadius,addService,updateCounters} from '../controllers/centerController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(getCenters).post(protect, authorize('admin'), createCenter);

router.route('/:id').get(getCenter).put(protect, authorize('admin'), updateCenter).delete(protect, authorize('admin'), deleteCenter);

router.get('/radius/:lng/:lat/:distance', getCentersInRadius);

router.post('/:id/services', protect, authorize('admin'), addService);

router.put('/:id/counters',protect,authorize('admin', 'staff'),updateCounters);

export default router;
