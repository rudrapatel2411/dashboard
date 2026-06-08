const { User, Institute, Student, Performance, TestPerformance } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user (admin internal use)
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

    // Only special admin emails get admin role. All others register as 'institution' pending approval
    const isSpecialAdmin = email.toLowerCase().includes('admin');
    const role = isSpecialAdmin ? 'admin' : 'institution';
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

// @desc    Register institute (creates both User + Institute records)
// @route   POST /api/auth/institute-register
// @access  Public
exports.instituteRegister = async (req, res) => {
  try {
    const { 
      name, email, phone, password,
      instituteName, city, state, address, contactPerson, mobile,
      type, sport
    } = req.body;

    // Validate required fields
    if (!name || !email || !password || !instituteName || !city || !state) {
      return res.status(400).json({ 
        message: 'Please provide all required fields: name, email, password, instituteName, city, state' 
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with institution role and pending status
    const user = await User.create({
      name,
      email,
      phone: phone || mobile,
      password: hashedPassword,
      role: 'institution',
      approvalStatus: 'pending'
    });

    // Create linked Institute record
    const institute = await Institute.create({
      userId: user._id,
      email,
      name: instituteName,
      city,
      state,
      address: address || '',
      contactPerson: contactPerson || name,
      mobile: mobile || phone || '',
      status: 'pending',
      type: type || 'institute',
      sport: type === 'academy' ? sport : undefined
    });

    // Send notification to admin dashboard
    try {
      const { sendNotification } = require('../routes/notifications');
      const typeLabel = type === 'academy' ? 'Academy' : 'Institute';
      sendNotification(
        `New ${typeLabel} Registration`,
        `"${instituteName}" (${city}, ${state}) has registered as an ${typeLabel} and is awaiting approval.`,
        "warning"
      );
    } catch (e) {
      // Silent catch
    }

    res.status(201).json({
      message: 'Registration successful! Your account is pending admin approval. You will be able to login once approved.',
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      approvalStatus: user.approvalStatus,
      instituteId: institute._id,
      instituteName: institute.name
    });
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

      // Build response
      const responseData = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        approvalStatus: user.approvalStatus,
        token: generateToken(user._id)
      };

      // If institution user, attach instituteId
      if (user.role === 'institution') {
        const institute = await Institute.findOne({ userId: user._id });
        if (institute) {
          responseData.instituteId = institute._id;
          responseData.instituteName = institute.name;
          responseData.instituteType = institute.type;
          responseData.sport = institute.sport;
        }
      }

      res.json(responseData);
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

    // SECURITY: OTP is NEVER sent in the API response.
    // In production: integrate an email/SMS provider here to deliver the OTP.
    // In development: the OTP is logged to the server console only.
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEV OTP] Email: ${user.email} | OTP: ${otp}`);
    }

    res.json({
      message: 'OTP verification code generated. Check your registered email/phone (or server console in development).',
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

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let institute = null;
    if (user.role === 'institution') {
      institute = await Institute.findOne({ userId: user._id });
    }

    res.json({ user, institute });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, email, ...instituteFields } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email already exists on another user
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email is already in use by another account' });
      }
      user.email = email;
    }

    // Update user fields
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;

    // Handle avatar upload
    if (req.file) {
      user.avatar = `/uploads/${req.file.filename}`;
    }

    await user.save();

    let institute = null;
    if (user.role === 'institution') {
      institute = await Institute.findOne({ userId: user._id });
      if (institute) {
        // Update institute fields
        if (instituteFields.instituteName) institute.name = instituteFields.instituteName;
        if (instituteFields.city) institute.city = instituteFields.city;
        if (instituteFields.state) institute.state = instituteFields.state;
        if (instituteFields.address !== undefined) institute.address = instituteFields.address;
        if (instituteFields.contactPerson !== undefined) institute.contactPerson = instituteFields.contactPerson;
        if (instituteFields.mobile !== undefined) institute.mobile = instituteFields.mobile;
        if (instituteFields.sport !== undefined) institute.sport = instituteFields.sport;
        if (email) institute.email = email; // sync email

        await institute.save();
      }
    }

    // Exclude password from returned user object
    const updatedUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      approvalStatus: user.approvalStatus
    };

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser,
      institute
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete user account and all associated data
// @route   DELETE /api/auth/delete-account
// @access  Private
exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'institution') {
      const institute = await Institute.findOne({ userId: user._id });
      if (institute) {
        // 1. Find all students belonging to this institute
        const students = await Student.find({ instituteId: institute._id });
        const studentIds = students.map(s => s._id);

        if (studentIds.length > 0) {
          // 2. Delete all performance entries for these students
          await Performance.deleteMany({ studentId: { $in: studentIds } });
          
          // 3. Delete all academic test performance entries for these students
          await TestPerformance.deleteMany({ studentId: { $in: studentIds } });

          // 4. Delete the students themselves
          await Student.deleteMany({ instituteId: institute._id });
        }

        // 5. Delete the institute details record
        await Institute.findByIdAndDelete(institute._id);
      }
    }

    // 6. Delete the authentication User record
    await User.findByIdAndDelete(user._id);

    res.json({ message: 'Account and all associated records deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
