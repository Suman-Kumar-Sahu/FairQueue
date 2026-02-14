import { generateSlotsForAllCenters } from '../../jobs/slotJobs.js';
import Slot from '../model/Slot.js';
import ServiceCenter from '../model/ServiceCenter.js';
import { ErrorResponse } from '../middleware/errorHandler.js';

// Manual slot generation (for debugging/admin use)
export const manualGenerateSlots = async (req, res, next) => {
  try {
    const { days = 7 } = req.body;

    console.log(`🔄 Manual slot generation requested for ${days} days`);

    await generateSlotsForAllCenters(parseInt(days));

    // Get count of slots
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + parseInt(days));

    const slotCount = await Slot.countDocuments({
      date: { $gte: today, $lt: futureDate }
    });

    res.status(200).json({
      success: true,
      message: `Successfully generated slots for next ${days} days`,
      data: {
        days: parseInt(days),
        totalSlots: slotCount
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get slot statistics
export const getSlotStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Today's slots
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todaySlots = await Slot.countDocuments({
      date: { $gte: today, $lt: tomorrow }
    });

    // Next 7 days
    const sevenDays = new Date(today);
    sevenDays.setDate(sevenDays.getDate() + 7);
    
    const weekSlots = await Slot.countDocuments({
      date: { $gte: today, $lt: sevenDays }
    });

    // Slots by status
    const slotsByStatus = await Slot.aggregate([
      {
        $match: {
          date: { $gte: today }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Slots by center
    const slotsByCenter = await Slot.aggregate([
      {
        $match: {
          date: { $gte: today, $lt: sevenDays }
        }
      },
      {
        $lookup: {
          from: 'servicecenters',
          localField: 'center',
          foreignField: '_id',
          as: 'centerInfo'
        }
      },
      {
        $unwind: '$centerInfo'
      },
      {
        $group: {
          _id: '$center',
          centerName: { $first: '$centerInfo.name' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Active centers count
    const activeCenters = await ServiceCenter.countDocuments({ isActive: true });

    res.status(200).json({
      success: true,
      data: {
        summary: {
          todaySlots,
          weekSlots,
          activeCenters
        },
        byStatus: slotsByStatus,
        byCenter: slotsByCenter,
        generatedAt: new Date()
      }
    });
  } catch (error) {
    next(error);
  }
};

// Clear all future slots (dangerous - admin only!)
export const clearFutureSlots = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await Slot.deleteMany({
      date: { $gte: today }
    });

    console.log(`🗑️  Cleared ${result.deletedCount} future slots`);

    res.status(200).json({
      success: true,
      message: 'All future slots cleared',
      data: {
        deletedCount: result.deletedCount
      }
    });
  } catch (error) {
    next(error);
  }
};