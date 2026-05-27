const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, resetPassword, instituteRegister } = require('../controllers/authController');

router.post('/register', register);
router.post('/institute-register', instituteRegister);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
