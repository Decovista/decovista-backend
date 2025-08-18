const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  propertyName: { type: String, required: true },
  city: String,
  best_time: String,
  message: String,
  submitted_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Contact", contactSchema);
