import cron from 'node-cron';
import Booking from '../src/model/Booking.js';
import Slot from '../src/model/Slot.js';
import User from '../src/model/User.js';

// Check for late arrivals every 15 minutes
const checkLateArrivals = cron.schedule('*/15 * * * *', async () => {
  console.log('⏰ Checking for late arrivals...');

  try {
    const now = new Date();

    const lateBookings = await Booking.find({
      status: { $in: ['booked', 'confirmed'] }
    }).populate('slot');

    console.log(`📊 Found ${lateBookings.length} active booking(s) to check`);

    let markedAsNoShow = 0;

    for (const booking of lateBookings) {
      if (!booking.slot) {
        console.log(`⚠️  Booking ${booking.bookingNumber} has no slot, skipping`);
        continue;
      }

      const slotDate = new Date(booking.slot.date);
      const [slotHour, slotMin] = booking.slot.startTime.split(':').map(Number);
      slotDate.setHours(slotHour, slotMin, 0, 0);

      const lateThreshold = new Date(slotDate.getTime() + 15 * 60 * 1000); // 15 min grace period

      if (now > lateThreshold) {
        booking.status = 'no-show';
        await booking.save();

        // Update slot
        const slot = await Slot.findById(booking.slot._id);
        if (slot) {
          slot.currentLoad = Math.max(0, slot.currentLoad - 1);
          slot.updateStatus();
          await slot.save();
        }

        // Penalize user
        const user = await User.findById(booking.user);
        if (user) {
          user.noShowCount = (user.noShowCount || 0) + 1;

          if (user.noShowCount >= 3) {
            user.isPenalized = true;
            user.penaltyEndDate = new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days penalty
            );
            console.log(`⚠️  User ${user.email} penalized for ${user.noShowCount} no-shows`);
          }

          await user.save();
        }

        markedAsNoShow++;
        console.log(`❌ Marked booking ${booking.bookingNumber} as no-show`);
      }
    }

    if (markedAsNoShow > 0) {
      console.log(`✅ Marked ${markedAsNoShow} booking(s) as no-show`);
    } else {
      console.log(`✅ No late arrivals found`);
    }
  } catch (error) {
    console.error('❌ Error checking late arrivals:', error);
  }
}, {
  scheduled: false // Don't start automatically
});

// Cancel old pending bookings (runs at 1 AM daily)
const cancelOldBookings = cron.schedule('0 1 * * *', async () => {
  console.log('🧹 Cancelling old pending bookings...');

  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const result = await Booking.updateMany(
      {
        status: { $in: ['booked', 'confirmed'] },
        createdAt: { $lt: yesterday }
      },
      {
        $set: {
          status: 'cancelled',
          cancellationReason: 'Auto-cancelled (expired)'
        }
      }
    );

    console.log(`🗑️  Auto-cancelled ${result.modifiedCount} old booking(s)`);
  } catch (error) {
    console.error('❌ Error cancelling old bookings:', error);
  }
}, {
  scheduled: false // Don't start automatically
});

export {
  checkLateArrivals,
  cancelOldBookings
};