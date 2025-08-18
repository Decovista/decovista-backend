const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  product: { type: String, required: true },
  city: { type: String, required: true },
  best_time: { type: String },
  message: { type: String },
  submitted_at: {
    type: String,
    default: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
  },
});

module.exports = mongoose.model("Contact", contactSchema);
