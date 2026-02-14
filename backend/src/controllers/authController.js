import User from '../model/User.js';
import generateToken from '../utills/generateToken.js';
import { ErrorResponse } from '../middleware/errorHandler.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role, aadhaarNumber } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new ErrorResponse('User already exists with this email', 400));
    }

    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      return next(new ErrorResponse('User already exists with this phone number', 400));
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: role || 'citizen',
      aadhaarNumber
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        aadhaarNumber: user.aadhaarNumber,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorResponse('Please provide email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        aadhaarNumber: user.aadhaarNumber,
        noShowCount: user.noShowCount,
        isPenalized: user.isPenalized,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('assignedCenter');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const updateDetails = async (req, res, next) => {
  try {
    const { name, phone, aadhaarNumber } = req.body;

    const fieldsToUpdate = {};
    
    if (name !== undefined && name !== null && name !== '') {
      fieldsToUpdate.name = name;
    }
    
    if (phone !== undefined && phone !== null && phone !== '') {
      fieldsToUpdate.phone = phone;
    }
    
    if (aadhaarNumber !== undefined) {
      fieldsToUpdate.aadhaarNumber = aadhaarNumber === '' ? null : aadhaarNumber;
    }

    if (fieldsToUpdate.phone) {
      const phoneExists = await User.findOne({ 
        phone: fieldsToUpdate.phone,
        _id: { $ne: req.user.id } 
      });
      
      if (phoneExists) {
        return next(new ErrorResponse('Phone number already in use', 400));
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id, 
      fieldsToUpdate, 
      {
        new: true,
        runValidators: true
      }
    );

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        aadhaarNumber: user.aadhaarNumber,
        noShowCount: user.noShowCount,
        isPenalized: user.isPenalized
      }
    });
  } catch (error) {
    console.error('❌ Update Details Error:', error);
    next(error);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.matchPassword(req.body.currentPassword))) {
      return next(new ErrorResponse('Current password is incorrect', 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      data: { token },
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {},
    message: 'Logged out successfully'
  });
};