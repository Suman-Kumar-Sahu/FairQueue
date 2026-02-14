import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    center: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceCenter',
      required: true
    },
    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Slot',
      required: true
    },
    service: {
      type: String,
      required: true
    },
    bookingNumber: {
      type: String,
      unique: true,
      required: true
    },
    status: {
      type: String,
      enum: ['booked', 'confirmed', 'checked-in', 'completed', 'cancelled', 'no-show'],
      default: 'booked'
    },
    priority: {
      type: String,
      enum: ['normal', 'senior-citizen', 'disabled', 'emergency'],
      default: 'normal'
    },
    tokenNumber: {
      type: Number
    },
    checkInTime: {
      type: Date
    },
    completionTime: {
      type: Date
    },
    cancellationReason: {
      type: String
    },
    notes: {
      type: String
    },
    isWaitlisted: {
      type: Boolean,
      default: false
    },
    waitlistPosition: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);

bookingSchema.index({ user: 1, slot: 1 }, { unique: true });
bookingSchema.index({ slot: 1, status: 1 });
bookingSchema.index({ center: 1, createdAt: -1 });

bookingSchema.pre('save', async function () {
  if (this.isNew) {
    const count = await mongoose.model('Booking').countDocuments();
    this.bookingNumber = `QW${Date.now()}${count + 1}`;
  }
});

export default mongoose.model('Booking', bookingSchema);
