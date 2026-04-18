const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  duration: { type: Number, required: true }, // in months
  price: { type: Number, required: true },
  description: { type: String, trim: true },
  features: [{ type: String }],
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Plan', planSchema);
