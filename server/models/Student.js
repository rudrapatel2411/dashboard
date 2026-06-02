const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true
    // Note: unique constraint removed from field level — see compound index below
  },
  name: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  class: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  taaluka: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  instituteId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Institute' 
  }
}, {
  timestamps: true
});

// Fix #7: Compound unique index — studentId must be unique PER institute, not globally.
// This prevents cross-institute ID collisions that caused unhandled E11000 duplicate key errors.
studentSchema.index({ studentId: 1, instituteId: 1 }, { unique: true });

module.exports = mongoose.model('Student', studentSchema);
