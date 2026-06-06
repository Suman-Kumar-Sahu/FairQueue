import cron from 'node-cron';
import Slot from '../src/model/Slot.js';
import ServiceCenter from '../src/model/ServiceCenter.js';
import { generateSlotsForDays } from '../src/utills/slotGenerator.js';

// Function to generate slots for all active centers
const generateSlotsForAllCenters = async (days = 7) => {
  console.log(`🔄 Generating slots for next ${days} days...`);

  try {
    const centers = await ServiceCenter.find({ isActive: true });
    
    if (centers.length === 0) {
      console.log('⚠️  No active centers found');
      return;
    }

    console.log(`📍 Found ${centers.length} active center(s)`);

    for (const center of centers) {
      try {
        await generateSlotsForDays(center, days);
        console.log(`✅ Generated slots for: ${center.name}`);
      } catch (error) {
        console.error(`❌ Error generating slots for ${center.name}:`, error.message);
      }
    }

    console.log('✅ Slot generation completed');
  } catch (error) {
    console.error('❌ Error in slot generation:', error);
  }
};

// Run daily at midnight to generate next day's slots
const generateDailySlots = cron.schedule('0 0 * * *', async () => {
  console.log('⏰ Running scheduled daily slot generation...');
  await generateSlotsForAllCenters(1); // Generate for next 1 day
}, {
  scheduled: false // Don't start automatically
});

// Clean up old slots (runs at 2 AM daily)
const cleanupOldSlots = cron.schedule('0 2 * * *', async () => {
  console.log('🧹 Running old slots cleanup...');

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await Slot.deleteMany({
      date: { $lt: thirtyDaysAgo }
    });

    console.log(`🗑️  Deleted ${result.deletedCount} old slots`);
  } catch (error) {
    console.error('❌ Error in slots cleanup:', error);
  }
}, {
  scheduled: false // Don't start automatically
});

// Initialize slots on server start
const initializeSlots = async () => {
  console.log('🚀 Initializing slots on server start...');
  
  try {
    await generateSlotsForAllCenters(7);
    console.log('✅ Slots initialized for the next 7 days.');
  } catch (error) {
    console.error('❌ Error initializing slots:', error);
  }
};

export {
  generateDailySlots,
  cleanupOldSlots,
  initializeSlots,
  generateSlotsForAllCenters
};