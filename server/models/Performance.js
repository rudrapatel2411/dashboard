const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  term: {
    type: String,
    enum: ['TERM-1', 'TERM-2'],
    required: true
  },
  // Metrics
  speed: { type: Number, required: true },
  strength: { type: Number, required: true },
  stamina: { type: Number, required: true },
  agility: { type: Number, required: true },
  flexibility: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  endurance: { type: Number, required: true },
  reactionTime: { type: Number, required: true },
  
  // Other aspects
  attendance: { type: Number, required: true }, // Percentage 0-100
  discipline: { type: Number, required: true }, // 0-10
  matchPerformance: { type: Number, required: true }, // 0-100
  
  // Computed fields
  overallScore: {
    type: Number
  },
  fitnessLevel: {
    type: String // Excellent, Good, Average, Poor
  },
  aiInsight: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Performance', performanceSchema);
