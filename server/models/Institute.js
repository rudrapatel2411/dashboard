const mongoose = require('mongoose');
const instituteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String },
  name: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  address: { type: String },
  contactPerson: { type: String },
  mobile: { type: String },
  type: { type: String, enum: ['institute', 'academy'], default: 'institute' },
  sport: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });
module.exports = mongoose.model('Institute', instituteSchema);
