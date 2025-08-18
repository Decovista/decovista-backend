const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { Pname, slug, text, category, Ideal, WhatsIncluded } = req.body;

    const newProduct = new Product({
      Pname,
      slug,
      text,
      category,
      Ideal: Ideal.split(',').map(item => item.trim()),
      WhatsIncluded: WhatsIncluded.split(',').map(item => item.trim()),
      imageUrl: req.file ? `/uploads/${req.file.filename}` : ''
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// GET: All products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
