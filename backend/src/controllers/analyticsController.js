import Booking from '../model/Booking.js';
import Slot from '../model/Slot.js';
import User from '../model/User.js';
import LoadMetrics from '../model/LoadMetrics.js';
import ServiceCenter from '../model/ServiceCenter.js';
import { ErrorResponse } from '../middleware/errorHandler.js';

export const getCenterAnalytics = async (req, res, next) => {
  try {
    const { centerId } = req.params;
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Build the filter object conditionally
    const filter = { ...dateFilter };
    if (centerId !== 'all') {
      filter.center = centerId;
    }

    const totalBookings = await Booking.countDocuments(filter);

    const statusBreakdown = await Booking.aggregate([
      {
        $match: filter
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const noShowCount =
      statusBreakdown.find(s => s._id === 'no-show')?.count || 0;
    const noShowRate =
      totalBookings > 0
        ? ((noShowCount / totalBookings) * 100).toFixed(2)
        : 0;

    const completedCount =
      statusBreakdown.find(s => s._id === 'completed')?.count || 0;
    const completionRate =
      totalBookings > 0
        ? ((completedCount / totalBookings) * 100).toFixed(2)
        : 0;

    const daysDiff =
      startDate && endDate
        ? Math.ceil(
            (new Date(endDate) - new Date(startDate)) /
              (1000 * 60 * 60 * 24)
          )
        : 30;

    const avgBookingsPerDay = (totalBookings / daysDiff).toFixed(2);

    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        statusBreakdown,
        noShowRate: parseFloat(noShowRate),
        completionRate: parseFloat(completionRate),
        avgBookingsPerDay: parseFloat(avgBookingsPerDay)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getPeakHours = async (req, res, next) => {
  try {
    const { centerId } = req.params;
    const { date } = req.query;

    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    // Build the filter object conditionally
    const filter = {
      date: { $gte: startOfDay, $lte: endOfDay }
    };
    if (centerId !== 'all') {
      filter.center = centerId;
    }

    const slots = await Slot.find(filter);

    const hourlyData = {};

    slots.forEach(slot => {
      const hour = parseInt(slot.startTime.split(':')[0]);
      if (!hourlyData[hour]) {
        hourlyData[hour] = {
          hour: `${String(hour).padStart(2, '0')}:00`,
          totalCapacity: 0,
          totalBookings: 0,
          averageLoad: 0,
          slotCount: 0
        };
      }

      hourlyData[hour].totalCapacity += slot.capacity;
      hourlyData[hour].totalBookings += slot.currentLoad;
      hourlyData[hour].slotCount += 1;
    });

    const peakHours = Object.values(hourlyData)
      .map(data => ({
        ...data,
        averageLoad:
          data.totalCapacity > 0
            ? ((data.totalBookings / data.totalCapacity) * 100).toFixed(2)
            : 0,
        utilizationRate:
          data.totalCapacity > 0
            ? ((data.totalBookings / data.totalCapacity) * 100).toFixed(2)
            : 0
      }))
      .sort((a, b) => b.averageLoad - a.averageLoad);

    res.status(200).json({
      success: true,
      data: peakHours
    });
  } catch (error) {
    next(error);
  }
};

export const getLoadTrends = async (req, res, next) => {
  try {
    const { centerId } = req.params;
    const { days = 7 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Build the match filter conditionally
    const matchFilter = {
      date: { $gte: startDate }
    };
    if (centerId !== 'all') {
      matchFilter.center = centerId;
    }

    const dailyMetrics = await LoadMetrics.aggregate([
      {
        $match: matchFilter
      },
      {
        $group: {
          _id: '$date',
          totalBookings: { $sum: '$totalBookings' },
          completedBookings: { $sum: '$completedBookings' },
          noShows: { $sum: '$noShows' },
          avgWaitTime: { $avg: '$averageWaitTime' },
          peakLoad: { $max: '$peakLoad' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: dailyMetrics
    });
  } catch (error) {
    next(error);
  }
};

export const getOverallStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'citizen' });
    const totalCenters = await ServiceCenter.countDocuments({ isActive: true });
    const totalBookings = await Booking.countDocuments();

    const todayBookings = await Booking.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lte: new Date(new Date().setHours(23, 59, 59, 999))
      }
    });

    const activeBookings = await Booking.countDocuments({
      status: { $in: ['booked', 'confirmed', 'checked-in'] }
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalCenters,
        totalBookings,
        todayBookings,
        activeBookings
      }
    });
  } catch (error) {
    next(error);
  }
};