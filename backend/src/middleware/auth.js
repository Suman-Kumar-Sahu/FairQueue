import jwt from 'jsonwebtoken';
import User from '../model/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};

export const checkPenalty = async (req, res, next) => {
  if (req.user.isPenalized) {
    if (req.user.penaltyEndDate && req.user.penaltyEndDate > new Date()) {
      return res.status(403).json({
        success: false,
        message: `You are temporarily blocked from booking due to multiple no-shows. Penalty ends on ${req.user.penaltyEndDate.toLocaleDateString()}`
      });
    } else {
      req.user.isPenalized = false;
      req.user.penaltyEndDate = null;
      await req.user.save();
    }
  }
  next();
};
