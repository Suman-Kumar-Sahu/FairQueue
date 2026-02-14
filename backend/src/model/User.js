import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
      match: [/^[6-9]\d{9}$/, 'Please provide a valid Indian phone number']
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ['citizen', 'staff', 'admin'],
      default: 'citizen'
    },
    aadhaarNumber: {
      type: String,
      sparse: true,
      match: [/^\d{12}$/, 'Please provide a valid Aadhaar number']
    },
    noShowCount: {
      type: Number,
      default: 0
    },
    isPenalized: {
      type: Boolean,
      default: false
    },
    penaltyEndDate: {
      type: Date
    },
    assignedCenter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceCenter'
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
