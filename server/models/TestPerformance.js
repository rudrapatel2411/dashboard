const mongoose = require('mongoose');

const testPerformanceSchema = new mongoose.Schema({
  instituteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institute',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  class: {
    type: String,
    required: true
  },
  examName: {
    type: String,
    required: true
  },
  term: {
    type: String,
    enum: ['TERM-1', 'TERM-2', 'HALF-YEARLY', 'ANNUAL'],
    required: true
  },
  subjects: [{
    subjectName: { type: String, required: true },
    marks: { type: Number, required: true },
    maxMarks: { type: Number, required: true, default: 100 }
  }],
  totalMarks: {
    type: Number
  },
  totalMaxMarks: {
    type: Number
  },
  percentage: {
    type: Number
  },
  grade: {
    type: String
  },
  marksheetImageUrl: {
    type: String
  },
  remarks: {
    type: String
  }
}, {
  timestamps: true
});

// Pre-save hook to compute totals
testPerformanceSchema.pre('save', function (next) {
  if (this.subjects && this.subjects.length > 0) {
    this.totalMarks = this.subjects.reduce((sum, s) => sum + s.marks, 0);
    this.totalMaxMarks = this.subjects.reduce((sum, s) => sum + s.maxMarks, 0);
    this.percentage = this.totalMaxMarks > 0
      ? parseFloat(((this.totalMarks / this.totalMaxMarks) * 100).toFixed(2))
      : 0;

    // Grade assignment
    if (this.percentage >= 90) this.grade = 'A+';
    else if (this.percentage >= 80) this.grade = 'A';
    else if (this.percentage >= 70) this.grade = 'B+';
    else if (this.percentage >= 60) this.grade = 'B';
    else if (this.percentage >= 50) this.grade = 'C';
    else if (this.percentage >= 40) this.grade = 'D';
    else this.grade = 'F';
  }
  next();
});

module.exports = mongoose.model('TestPerformance', testPerformanceSchema);
