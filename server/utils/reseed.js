const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const seedStudents = require('./seeder');

const reseed = async () => {
  try {
    const confirmed = process.argv.includes('--yes') || process.env.ALLOW_DESTRUCTIVE_RESEED === 'true';
    if (!confirmed) {
      console.error("Refusing to reseed without confirmation. Run `node utils/reseed.js --yes` or set ALLOW_DESTRUCTIVE_RESEED=true.");
      process.exit(1);
    }

    console.log("Connecting to MongoDB for reseeding...");
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sport-sphere');
    console.log(`Connected to ${conn.connection.host}/${conn.connection.name}`);

    console.log("Running forced reseed...");
    await seedStudents(true);

    console.log("Reseed sequence complete.");
    process.exit(0);
  } catch (error) {
    console.error("Reseed failed:", error.message);
    process.exit(1);
  }
};

reseed();
