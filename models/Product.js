const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  Pname: String,
  slug: String,
  text: String,
  category: String,
  Ideal: [String],
  WhatsIncluded: [String],
  imageUrl: String
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
