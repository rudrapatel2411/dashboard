const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    let admin = await User.findOne({ email: 'admin@gmail.com' });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    if (!admin) {
      console.log('No admin with email admin@gmail.com found. Creating one...');
      admin = await User.create({
        name: 'System Admin',
        email: 'admin@gmail.com',
        phone: '1234567890',
        password: hashedPassword,
        role: 'admin',
        approvalStatus: 'approved'
      });
      console.log('Created new admin.');
    } else {
      console.log('User admin@gmail.com already exists. Updating to admin role and resetting password...');
      admin.role = 'admin';
      admin.approvalStatus = 'approved';
      admin.password = hashedPassword;
      await admin.save();
      console.log('Configured admin@gmail.com as approved admin.');
    }
    
    console.log(`\n--- Admin Credentials ---`);
    console.log(`Email: admin@gmail.com`);
    console.log(`Password: 123456\n`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
