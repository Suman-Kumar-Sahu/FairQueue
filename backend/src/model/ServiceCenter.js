import mongoose from 'mongoose';

const serviceCenterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide center name'],
      trim: true
    },
    type: {
      type: String,
      enum: ['aadhaar', 'pan', 'passport', 'rto', 'municipal', 'other'],
      default: 'aadhaar'
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        index: '2dsphere',
        default: [0, 0]
      }
    },
    workingHours: {
      start: {
        type: String,
        required: true,
        default: '09:00'
      },
      end: {
        type: String,
        required: true,
        default: '17:00'
      }
    },
    workingDays: {
      type: [Number],
      default: [1, 2, 3, 4, 5, 6]
    },
    slotDuration: {
      type: Number,
      required: true,
      default: 15
    },
    capacityPerSlot: {
      type: Number,
      required: true,
      default: 4
    },
    services: [
      {
        name: {
          type: String,
          required: true
        },
        duration: {
          type: Number,
          required: true
        },
        description: String
      }
    ],
    isActive: {
      type: Boolean,
      default: true
    },
    totalCounters: {
      type: Number,
      default: 4
    },
    activeCounters: {
      type: Number,
      default: 4
    }
  },
  {
    timestamps: true
  }
);

serviceCenterSchema.index({ location: '2dsphere' });

export default mongoose.model('ServiceCenter', serviceCenterSchema);
