import Slot from '../model/Slot.js';
import ServiceCenter from '../model/ServiceCenter.js';
import {generateSlotsForDate,generateSlotsForDays} from '../utills/slotGenerator.js';
import {findAlternativeSlots,estimateWaitTime,calculateLoadScore} from '../utills/loadCalculator.js';
import { ErrorResponse } from '../middleware/errorHandler.js';

export const getSlots = async (req, res, next) => {
  try {
    const { center, date, status } = req.query;

    if (!center || !date) {
      return next(new ErrorResponse('Please provide center and date', 400));
    }

    const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const query = {
    center,
    date: { $gte: start, $lte: end }
  };


    if (status) {
      query.status = status;
    }

    const slots = await Slot.find(query)
      .populate('center', 'name type')
      .sort('startTime');

    const slotsWithScore = slots.map(slot => ({
      ...slot.toObject(),
      loadScore: calculateLoadScore(slot),
      estimatedWait: estimateWaitTime(slot)
    }));

    res.status(200).json({
      success: true,
      count: slots.length,
      data: slotsWithScore
    });
  } catch (error) {
    next(error);
  }
};

export const getSlot = async (req, res, next) => {
  try {
    const slot = await Slot.findById(req.params.id).populate('center');

    if (!slot) {
      return next(
        new ErrorResponse(`Slot not found with id ${req.params.id}`, 404)
      );
    }

    const slotData = {
      ...slot.toObject(),
      loadScore: calculateLoadScore(slot),
      estimatedWait: estimateWaitTime(slot)
    };

    res.status(200).json({
      success: true,
      data: slotData
    });
  } catch (error) {
    next(error);
  }
};

export const generateSlots = async (req, res, next) => {
  try {
    const { centerId, date, days } = req.body;

    const center = await ServiceCenter.findById(centerId);

    if (!center) {
      return next(
        new ErrorResponse(`Center not found with id ${centerId}`, 404)
      );
    }

    let slotsGenerated;

    if (date) {
      const slots = await generateSlotsForDate(center, new Date(date));
      slotsGenerated = await Slot.insertMany(slots, { ordered: false });
    } else {
      slotsGenerated = await generateSlotsForDays(center, days || 7);
    }

    res.status(201).json({
      success: true,
      message: `Generated ${slotsGenerated.length || slotsGenerated} slots`,
      data: { count: slotsGenerated.length || slotsGenerated }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(200).json({
        success: true,
        message: 'Slots already exist for this period'
      });
    }
    next(error);
  }
};

export const getAlternatives = async (req, res, next) => {
  try {
    const slot = await Slot.findById(req.params.id);

    if (!slot) {
      return next(
        new ErrorResponse(`Slot not found with id ${req.params.id}`, 404)
      );
    }

    const alternatives = await findAlternativeSlots(Slot, slot, 5);

    const alternativesWithDetails = alternatives.map(alt => ({
      slot: alt.slot,
      loadScore: alt.loadScore,
      timeDifferenceMinutes: alt.timeDiffMinutes,
      estimatedWait: estimateWaitTime(alt.slot),
      recommendation:
        alt.combinedScore < 0.5
          ? 'Highly Recommended'
          : alt.combinedScore < 0.7
          ? 'Recommended'
          : 'Available'
    }));

    res.status(200).json({
      success: true,
      requestedSlot: {
        ...slot.toObject(),
        loadScore: calculateLoadScore(slot)
      },
      alternatives: alternativesWithDetails,
      message:
        slot.status === 'full'
          ? 'This slot is full. Here are better alternatives:'
          : 'Consider these less crowded alternatives:'
    });
  } catch (error) {
    next(error);
  }
};

export const updateSlotStatus = async (req, res, next) => {
  try {
    const { status, isActive } = req.body;

    const slot = await Slot.findById(req.params.id);

    if (!slot) {
      return next(
        new ErrorResponse(`Slot not found with id ${req.params.id}`, 404)
      );
    }

    if (status) {
      slot.status = status;
    }

    if (typeof isActive !== 'undefined') {
      slot.isActive = isActive;
    }

    await slot.save();

    res.status(200).json({
      success: true,
      data: slot
    });
  } catch (error) {
    next(error);
  }
};

export const getSlotSummary = async (req, res, next) => {
  try {
    const { center, date } = req.query;

    if (!center || !date) {
      return next(new ErrorResponse('Please provide center and date', 400));
    }

    const slots = await Slot.find({
      center,
      date: new Date(date)
    });

    const summary = {
      totalSlots: slots.length,
      availableSlots: slots.filter(s => s.status === 'available').length,
      fullSlots: slots.filter(s => s.status === 'full').length,
      closedSlots: slots.filter(s => s.status === 'closed').length,
      totalCapacity: slots.reduce((sum, s) => sum + s.capacity, 0),
      totalBookings: slots.reduce((sum, s) => sum + s.currentLoad, 0),
      averageLoad:
        slots.length > 0
          ? slots.reduce((sum, s) => sum + calculateLoadScore(s), 0) /
            slots.length
          : 0,
      peakHours: [],
      lowLoadHours: []
    };

    summary.utilizationPercentage =
      summary.totalCapacity > 0
        ? ((summary.totalBookings / summary.totalCapacity) * 100).toFixed(2)
        : 0;

    const hourlyLoad = {};
    slots.forEach(slot => {
      const hour = parseInt(slot.startTime.split(':')[0]);
      if (!hourlyLoad[hour]) {
        hourlyLoad[hour] = { total: 0, count: 0 };
      }
      hourlyLoad[hour].total += calculateLoadScore(slot);
      hourlyLoad[hour].count += 1;
    });

    Object.keys(hourlyLoad).forEach(hour => {
      const avgLoad = hourlyLoad[hour].total / hourlyLoad[hour].count;
      if (avgLoad > 0.7) {
        summary.peakHours.push(`${hour}:00`);
      } else if (avgLoad < 0.3) {
        summary.lowLoadHours.push(`${hour}:00`);
      }
    });

    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    next(error);
  }
};
