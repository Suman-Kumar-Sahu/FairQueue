import express from 'express';
import { body } from 'express-validator';
import {register,login,getMe,updateDetails,updatePassword,logout} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';

const router = express.Router();

const registerValidation = [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('phone').matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid Indian phone number'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('aadhaarNumber').optional().matches(/^\d{12}$/).withMessage('Aadhaar must be 12 digits')
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

const updateDetailsValidation = [
  body('name').optional().notEmpty().trim().withMessage('Name cannot be empty'),
  body('phone').optional().matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid Indian phone number'),
  body('aadhaarNumber').optional().custom((value) => {
    if (value === '' || value === null || value === undefined) {
      return true; 
    }
    if (!/^\d{12}$/.test(value)) {
      throw new Error('Aadhaar must be 12 digits');
    }
    return true;
  })
];

const updatePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetailsValidation, validate, updateDetails);
router.put('/updatepassword', protect, updatePasswordValidation, validate, updatePassword);
router.post('/logout', protect, logout);

export default router;