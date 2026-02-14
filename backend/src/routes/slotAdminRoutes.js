import express from 'express';
import { manualGenerateSlots, getSlotStats, clearFutureSlots } from '../controllers/slotAdminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Admin only routes for slot management
router.post('/admin/generate', protect, authorize('admin'), manualGenerateSlots);
router.get('/admin/stats', protect, authorize('admin'), getSlotStats);
router.delete('/admin/clear-future', protect, authorize('admin'), clearFutureSlots);

export default router;