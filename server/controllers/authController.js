const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Auto-approve first user or admin emails. Others register as 'institution' with 'pending' status
    const isFirstUser = (await User.countDocuments()) === 0;
    const isSpecialAdmin = email.toLowerCase().includes('admin');
    const role = (isFirstUser || isSpecialAdmin) ? 'admin' : 'institution';
    const approvalStatus = role === 'admin' ? 'approved' : 'pending';

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      approvalStatus
    });

    if (user) {
      if (role === 'institution') {
        try {
          const { sendNotification } = require('../routes/notifications');
          sendNotification(
            "New Institution Registration",
            `Institution "${name}" has registered and is pending admin approval.`,
            "warning"
          );
        } catch (e) {
          // Silent catch to handle server startup edge cases
        }
      }

      res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        approvalStatus: user.approvalStatus,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Support logging in with email or phone
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.findOne({ phone: email });
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      // Enforce Admin Approval check for non-admin accounts
      if (user.role !== 'admin' && user.approvalStatus !== 'approved') {
        return res.status(403).json({ 
          message: 'Your institution account is pending admin approval. You will be able to access the dashboard once approved by the administrator.' 
        });
      }

      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        approvalStatus: user.approvalStatus,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Forgot password - generate and store OTP
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { identifier } = req.body;

    if (!identifier) {
      return res.status(400).json({ message: 'Email or phone number is required' });
    }

    let user = await User.findOne({ email: identifier });
    if (!user) {
      user = await User.findOne({ phone: identifier });
    }

    if (!user) {
      return res.status(404).json({ message: 'User with this email or phone does not exist' });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpires = Date.now() + 15 * 60 * 1000; // 15 mins expiry
    await user.save();

    res.json({
      message: 'OTP verification code generated successfully.',
      otp,
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Reset password using OTP
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { otp, newPassword } = req.body;

    if (!otp || !newPassword) {
      return res.status(400).json({ message: 'OTP and new password are required' });
    }

    const user = await User.findOne({
      resetPasswordOTP: otp,
      resetPasswordOTPExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP. Please request a new one.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetPasswordOTP = null;
    user.resetPasswordOTPExpires = null;
    await user.save();

    res.json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
