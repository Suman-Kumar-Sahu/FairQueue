import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/model/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    const existingAdmin = await User.findOne({
      email: process.env.ADMIN_EMAIL,
    });

    if (existingAdmin) {
      console.log('Admin user already exists!');
      process.exit(0);
    }

    const admin = await User.create({
      name: 'Admin User',
      email:  process.env.ADMIN_EMAIL,
      phone: '9876543210',
      password: process.env.ADMIN_PASS,
      role: 'admin',
      aadhaarNumber: '123456789012',
    });

    console.log('Admin user created successfully!');
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('You can now login with these credentials');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
