const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  address: { type: String, trim: true },
  membershipPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer' },
  joinDate: { type: Date, default: Date.now },
  expiryDate: { type: Date },
  status: { type: String, enum: ['Active', 'Inactive', 'Expired'], default: 'Active' },
  photo: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);
