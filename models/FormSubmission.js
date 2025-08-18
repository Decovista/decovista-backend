const mongoose = require("mongoose");

const formSubmissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  product: { type: String, required: true },
  city: String,
  best_time: String,
  message: String,
  submitted_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FormSubmission", formSubmissionSchema);
