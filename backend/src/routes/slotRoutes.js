import express from 'express';
import {getSlots,getSlot,generateSlots,getAlternatives,updateSlotStatus,getSlotSummary} from '../controllers/slotController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getSlots);
router.get('/summary', getSlotSummary);
router.post('/generate', protect, authorize('admin'), generateSlots);

router.get('/:id', getSlot);
router.get('/:id/alternatives', getAlternatives);
router.put('/:id/status', protect, authorize('admin', 'staff'), updateSlotStatus);

export default router;
