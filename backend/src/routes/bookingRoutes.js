import express from 'express';
import {createBooking,getBookings,getBooking,cancelBooking,checkIn,completeBooking,markNoShow,getMyBookings} from '../controllers/bookingController.js';
import { protect, authorize, checkPenalty } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/my-bookings', getMyBookings);

router.route('/').get(getBookings).post(checkPenalty, createBooking);

router.route('/:id').get(getBooking);

router.put('/:id/cancel', cancelBooking);
router.post('/:id/checkin', authorize('staff', 'admin'), checkIn);
router.post('/:id/complete', authorize('staff', 'admin'), completeBooking);
router.post('/:id/no-show', authorize('staff', 'admin'), markNoShow);

export default router;
