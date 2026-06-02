const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { 
  register, 
  login, 
  forgotPassword, 
  resetPassword, 
  instituteRegister,
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { avatarUpload } = require('../utils/multerConfig');

// Fix #5: Rate limiting — prevent brute-force on auth endpoints
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Please try again in 15 minutes.' }
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many OTP requests. Please try again in 15 minutes.' }
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many registration attempts. Please try again later.' }
});

router.post('/register', registerLimiter, register);
router.post('/institute-register', registerLimiter, instituteRegister);
router.post('/login', loginLimiter, login);
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
router.post('/reset-password', forgotPasswordLimiter, resetPassword);

// Profile routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, avatarUpload.single('avatar'), updateProfile);
router.put('/change-password', protect, changePassword);
router.delete('/delete-account', protect, deleteAccount);

module.exports = router;
