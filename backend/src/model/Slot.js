import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema(
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
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    capacity: {
      type: Number,
      required: true
    },
    currentLoad: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['available', 'full', 'closed'],
      default: 'available'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

slotSchema.index({ center: 1, date: 1, startTime: 1 }, { unique: true });
slotSchema.index({ date: 1, status: 1 });

slotSchema.virtual('loadScore').get(function () {
  return this.capacity > 0 ? this.currentLoad / this.capacity : 0;
});

slotSchema.methods.updateStatus = function () {
  if (this.currentLoad >= this.capacity) {
    this.status = 'full';
  } else if (this.isActive) {
    this.status = 'available';
  } else {
    this.status = 'closed';
  }
};

export default mongoose.model('Slot', slotSchema);
