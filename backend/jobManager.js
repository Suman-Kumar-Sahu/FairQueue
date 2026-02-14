import { generateDailySlots, cleanupOldSlots, initializeSlots } from './jobs/slotJobs.js';
import { checkLateArrivals, cancelOldBookings } from './jobs/bookingJobs.js';

class JobManager {
  constructor() {
    this.jobs = [];
    this.isRunning = false;
  }

  async initialize() {
    console.log('\n📋 Initializing application...\n');
    
    try {
      await initializeSlots();
      console.log('✅ Slot initialization complete\n');
      return true;
    } catch (error) {
      console.error('❌ Error during initialization:', error);
      return false;
    }
  }

  start() {
    if (this.isRunning) {
      console.log('⚠️  Jobs are already running');
      return;
    }

    console.log('='.repeat(50));
    console.log('🕐 Starting scheduled jobs...\n');

    this.jobs = [
      { name: 'Daily Slot Generation', instance: generateDailySlots, schedule: 'midnight' },
      { name: 'Old Slots Cleanup', instance: cleanupOldSlots, schedule: '2 AM' },
      { name: 'Late Arrival Check', instance: checkLateArrivals, schedule: 'every 15 minutes' },
      { name: 'Old Booking Cancellation', instance: cancelOldBookings, schedule: '1 AM' }
    ];

    this.jobs.forEach(job => {
      job.instance.start();
      console.log(`✅ ${job.name}: Active (runs ${job.schedule})`);
    });

    this.isRunning = true;
    console.log('\n✅ All cron jobs started successfully');
    console.log('='.repeat(50));
  }

  stop() {
    if (!this.isRunning) {
      console.log('⚠️ Jobs are not running');
      return;
    }

    console.log('\n🛑 Stopping all cron jobs...');

    this.jobs.forEach(job => {
      job.instance.stop();
      console.log(`✅ ${job.name}: Stopped`);
    });

    this.isRunning = false;
    console.log('✅ All cron jobs stopped');
  }


  shouldRun() {
    return process.env.ENABLE_JOBS === 'true' || process.env.NODE_ENV === 'production';
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      jobs: this.jobs.map(job => ({
        name: job.name,
        schedule: job.schedule
      }))
    };
  }
}

export default new JobManager();