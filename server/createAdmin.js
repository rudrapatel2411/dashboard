const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('No admin found. Creating one...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      admin = await User.create({
        name: 'System Admin',
        email: 'admin@sportsphere.com',
        phone: '1234567890',
        password: hashedPassword,
        role: 'admin',
        approvalStatus: 'approved'
      });
      console.log('Created new admin.');
    } else {
      console.log('Admin already exists.');
      // Reset password to 'admin123' just in case
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash('admin123', salt);
      await admin.save();
      console.log('Reset existing admin password to admin123.');
    }
    
    console.log(`\n--- Admin Credentials ---`);
    console.log(`Email: ${admin.email}`);
    console.log(`Password: admin123\n`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
