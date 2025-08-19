const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: String,
  propertyName: String,
  city: String,
  best_time: String,
  message: String,
  submitted_at: { type: Date, default: Date.now },
}, { timestamps: true }); // adds createdAt and updatedAt automatically

module.exports = mongoose.model('Contact', contactSchema);
