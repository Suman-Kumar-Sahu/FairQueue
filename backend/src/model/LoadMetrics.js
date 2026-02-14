import mongoose from 'mongoose';

const loadMetricsSchema = new mongoose.Schema(
  {
    center: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceCenter',
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    hour: {
      type: Number,
      min: 0,
      max: 23,
      required: true
    },
    totalBookings: {
      type: Number,
      default: 0
    },
    completedBookings: {
      type: Number,
      default: 0
    },
    noShows: {
      type: Number,
      default: 0
    },
    cancellations: {
      type: Number,
      default: 0
    },
    averageWaitTime: {
      type: Number,
      default: 0
    },
    averageServiceTime: {
      type: Number,
      default: 0
    },
    peakLoad: {
      type: Number,
      default: 0
    },
    noShowRate: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

loadMetricsSchema.index({ center: 1, date: 1, hour: 1 }, { unique: true });

export default mongoose.model('LoadMetrics', loadMetricsSchema);
