import User from '../model/User.js';
import { ErrorResponse } from '../middleware/errorHandler.js';

export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.role) {
      query.role = req.query.role;
    }

    if (req.query.center) {
      query.assignedCenter = req.query.center;
    }

    const users = await User.find(query)
      .populate('assignedCenter', 'name type')
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort('-createdAt');

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: users
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('assignedCenter')
      .select('-password');

    if (!user) {
      return next(new ErrorResponse(`User not found with id ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return next(new ErrorResponse(`User not found with id ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return next(new ErrorResponse(`User not found with id ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

export const penalizeUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorResponse(`User not found with id ${req.params.id}`, 404));
    }

    user.noShowCount += 1;

    if (user.noShowCount >= 3) {
      user.isPenalized = true;
      const penaltyDays = 7;
      user.penaltyEndDate = new Date(
        Date.now() + penaltyDays * 24 * 60 * 60 * 1000
      );
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: user,
      message: user.isPenalized
        ? `User penalized until ${user.penaltyEndDate.toLocaleDateString()}`
        : `No-show count updated to ${user.noShowCount}`
    });
  } catch (error) {
    next(error);
  }
};

export const removePenalty = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorResponse(`User not found with id ${req.params.id}`, 404));
    }

    user.isPenalized = false;
    user.penaltyEndDate = null;
    user.noShowCount = 0;

    await user.save();

    res.status(200).json({
      success: true,
      data: user,
      message: 'Penalty removed successfully'
    });
  } catch (error) {
    next(error);
  }
};
