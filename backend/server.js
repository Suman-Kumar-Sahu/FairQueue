import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import app from './app.js';
import jobManager from './jobManager.js';

dotenv.config();

connectDB();

const PORT = process.env.PORT || 5000;
const ENV = process.env.NODE_ENV || 'development';

// Server Startup
const server = app.listen(PORT, async () => {
  printStartupBanner();

  await initializeApplication();

  startCronJobs();
  
  printReadyMessage();
});

// Initialization Functions
async function initializeApplication() {
  try {
    await jobManager.initialize();
  } catch (error) {
    console.error('❌ Application initialization failed:', error);
    process.exit(1);
  }
}

function startCronJobs() {
  const shouldRunJobs = jobManager.shouldRun();
  
  console.log('='.repeat(50));
  console.log(`⚙️  Cron Jobs: ${shouldRunJobs ? 'ENABLED' : 'DISABLED'}`);
  
  if (shouldRunJobs) {
    jobManager.start();
  } else {
    console.log('\n⚠️  Cron jobs are DISABLED');
  }
}

// Shutdown
function gracefulShutdown(signal) {
  console.log(`\n${signal} received, shutting down gracefully...`);
  
  if (jobManager.isRunning) {
    jobManager.stop();
  }
  
  server.close(() => {
    console.log('✅ HTTP server closed');
    console.log('👋 Goodbye!\n');
    process.exit(0);
  });
  
  setTimeout(() => {
    console.error('⚠️  Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});

function printStartupBanner() {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 QueueWise API Server');
  console.log('='.repeat(50));
  console.log(`📍 Port: ${PORT}`);
  console.log(`📅 Environment: ${ENV}`);
  console.log(`⏰ Started: ${new Date().toLocaleString()}`);
  console.log('='.repeat(50) + '\n');
}

function printReadyMessage() {
  console.log('='.repeat(50));
  console.log('✅ Server ready to accept requests');
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log('='.repeat(50) + '\n');
}