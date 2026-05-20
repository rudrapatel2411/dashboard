const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  height: { // in cm
    type: Number,
    required: true
  },
  weight: { // in kg
    type: Number,
    required: true
  },
  bmi: {
    type: Number
  },
  bmiCategory: {
    type: String
  },
  class: {
    type: String,
    required: true
  },
  contact: {
    type: String
  },
  assignedSport: {
    type: String,
    required: true
  },
  coachName: {
    type: String
  },
  photoUrl: {
    type: String
  },
  institutionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  tests: [{
    date: {
      type: Date,
      default: Date.now
    },
    sprintTime: Number,   // in seconds
    broadJump: Number,    // in cm
    pushups: Number,      // count
    recommendedSport: String,
    reportHardCopyUrl: String,
    manualReportData: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);
