import Booking from '../model/Booking.js';
import Slot from '../model/Slot.js';
import User from '../model/User.js';
import { ErrorResponse } from '../middleware/errorHandler.js';

// Helper function to generate unique booking number
const generateBookingNumber = () => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `BK-${timestamp}${random}`;
};

export const createBooking = async (req, res, next) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const { slotId, service, priority } = req.body;
    const userId = req.user.id;

    if (req.user.isPenalized && req.user.penaltyEndDate > new Date()) {
      throw new ErrorResponse(
        `You are temporarily blocked until ${req.user.penaltyEndDate.toLocaleDateString()}`,
        403
      );
    }

    const slot = await Slot.findById(slotId).session(session);

    if (!slot) {
      throw new ErrorResponse('Slot not found', 404);
    }

    if (!slot.isActive || slot.status === 'closed') {
      throw new ErrorResponse('This slot is not available', 400);
    }

    if (slot.currentLoad >= slot.capacity) {
      throw new ErrorResponse('This slot is full', 400);
    }

    const existingBooking = await Booking.findOne({
      user: userId,
      slot: slotId,
      status: { $in: ['booked', 'confirmed', 'checked-in'] }
    }).session(session);

    if (existingBooking) {
      throw new ErrorResponse('You already have a booking for this slot', 400);
    }

    const startOfDay = new Date(slot.date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(slot.date);
    endOfDay.setHours(23, 59, 59, 999);

    const todayBookingsCount = await Booking.countDocuments({
      user: userId,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ['booked', 'confirmed', 'checked-in'] }
    }).session(session);

    if (todayBookingsCount >= 2) {
      throw new ErrorResponse('You can only book maximum 2 slots per day', 400);
    }

    // Generate unique booking number
    const bookingNumber = generateBookingNumber();

    const booking = await Booking.create(
      [
        {
          user: userId,
          center: slot.center,
          slot: slotId,
          service,
          bookingNumber,
          priority: priority || 'normal',
          status: 'booked'
        }
      ],
      { session }
    );

    slot.currentLoad += 1;
    slot.updateStatus();
    await slot.save({ session });

    await session.commitTransaction();

    const populatedBooking = await Booking.findById(booking[0]._id)
      .populate('user', 'name email phone')
      .populate('center', 'name type address')
      .populate('slot', 'date startTime endTime');

    res.status(201).json({
      success: true,
      data: populatedBooking,
      message: 'Booking created successfully'
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export const getBookings = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'citizen') {
      query.user = req.user.id;
    } else if (req.user.role === 'staff' && req.user.assignedCenter) {  
      query.center = req.user.assignedCenter;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.center) {
      query.center = req.query.center;
    }

    if (req.query.date) {
      query['slot.date'] = new Date(req.query.date);
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate('center', 'name type address')
      .populate('slot', 'date startTime endTime capacity currentLoad')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

export const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone aadhaarNumber')
      .populate('center', 'name type address')
      .populate('slot', 'date startTime endTime capacity currentLoad');

    if (!booking) {
      return next(
        new ErrorResponse(`Booking not found with id ${req.params.id}`, 404)
      );
    }

    if (
      req.user.role === 'citizen' &&
      booking.user._id.toString() !== req.user.id
    ) {
      return next(
        new ErrorResponse('Not authorized to access this booking', 403)
      );
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (req, res, next) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const booking = await Booking.findById(req.params.id).session(session);

    if (!booking) {
      throw new ErrorResponse(
        `Booking not found with id ${req.params.id}`,
        404
      );
    }

    if (
      req.user.role === 'citizen' &&
      booking.user.toString() !== req.user.id
    ) {
      throw new ErrorResponse('Not authorized to cancel this booking', 403);
    }

    if (['cancelled', 'completed', 'no-show'].includes(booking.status)) {
      throw new ErrorResponse(
        `Cannot cancel booking with status: ${booking.status}`,
        400
      );
    }

    booking.status = 'cancelled';
    booking.cancellationReason = req.body.reason || 'User cancelled';
    await booking.save({ session });

    const slot = await Slot.findById(booking.slot).session(session);
    if (slot) {
      slot.currentLoad = Math.max(0, slot.currentLoad - 1);
      slot.updateStatus();
      await slot.save({ session });
    }

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      data: booking,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export const checkIn = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return next(
        new ErrorResponse(`Booking not found with id ${req.params.id}`, 404)
      );
    }

    if (!['booked', 'confirmed'].includes(booking.status)) {
      return next(
        new ErrorResponse(
          `Cannot check-in booking with status: ${booking.status}`,
          400
        )
      );
    }

    booking.status = 'checked-in';
    booking.checkInTime = new Date();
    await booking.save();

    res.status(200).json({
      success: true,
      data: booking,
      message: 'Check-in successful'
    });
  } catch (error) {
    next(error);
  }
};

export const completeBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return next(
        new ErrorResponse(`Booking not found with id ${req.params.id}`, 404)
      );
    }

    if (booking.status !== 'checked-in') {
      return next(
        new ErrorResponse('Can only complete checked-in bookings', 400)
      );
    }

    booking.status = 'completed';
    booking.completionTime = new Date();
    await booking.save();

    res.status(200).json({
      success: true,
      data: booking,
      message: 'Service completed successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const markNoShow = async (req, res, next) => {
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const booking = await Booking.findById(req.params.id).session(session);

    if (!booking) {
      throw new ErrorResponse(
        `Booking not found with id ${req.params.id}`,
        404
      );
    }

    booking.status = 'no-show';
    await booking.save({ session });

    const slot = await Slot.findById(booking.slot).session(session);
    if (slot) {
      slot.currentLoad = Math.max(0, slot.currentLoad - 1);
      slot.updateStatus();
      await slot.save({ session });
    }

    const user = await User.findById(booking.user).session(session);
    if (user) {
      user.noShowCount += 1;

      if (user.noShowCount >= 3) {
        user.isPenalized = true;
        user.penaltyEndDate = new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        );
      }

      await user.save({ session });
    }

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      data: booking,
      message: 'Marked as no-show and user penalized'
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('center', 'name type address')
      .populate('slot', 'date startTime endTime')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};