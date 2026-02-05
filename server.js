import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/config/db.js';

dotenv.config();

connectDB();

import { generateDailySlots, cleanupOldSlots } from './jobs/slotJobs.js';
import { checkLateArrivals, cancelOldBookings } from './jobs/bookingJobs.js';

if (
  process.env.NODE_ENV === 'production' ||
  process.env.ENABLE_JOBS === 'true'
) {
  generateDailySlots.start();
  cleanupOldSlots.start();
  checkLateArrivals.start();
  cancelOldBookings.start();
  console.log('Cron jobs started');
}


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'QueueWise API is running...' });
});

import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import centerRoutes from './src/routes/centerRoutes.js';
import slotRoutes from './src/routes/slotRoutes.js';
import bookingRoutes from './src/routes/bookingRoutes.js';
import analyticsRoutes from './src/routes/analyticsRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/centers', centerRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});





