const mongoose = require('mongoose');
require('dotenv').config({ path: '../../.env' });
const Student = require('../models/Student');
const seedStudents = require('./seeder');

const reseed = async () => {
  try {
    console.log("Connecting to MongoDB for reseeding...");
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sport-sphere');
    
    console.log("Clearing existing student collection...");
    await Student.deleteMany({});
    console.log("Collection cleared.");

    console.log("Running seeder...");
    await seedStudents(true);

    console.log("Reseed sequence complete.");
    process.exit(0);
  } catch (error) {
    console.error("Reseed failed:", error.message);
    process.exit(1);
  }
};

reseed();
