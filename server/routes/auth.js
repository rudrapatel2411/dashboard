const express = require('express');
const router = express.Router();
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

router.post('/register', register);
router.post('/institute-register', instituteRegister);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Profile routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, avatarUpload.single('avatar'), updateProfile);
router.put('/change-password', protect, changePassword);
router.delete('/delete-account', protect, deleteAccount);

module.exports = router;
