const mongoose = require('mongoose');
require('dotenv').config();
const seedStudents = require('../utils/seeder');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    if (process.env.AUTO_SEED === 'true') {
      await seedStudents();
    } else {
      console.log("AUTO_SEED is not true. Skipping startup seeder.");
    }
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
