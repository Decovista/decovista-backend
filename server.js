require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/products', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Product schema & model
const productSchema = new mongoose.Schema({
  Pname: String,
  slug: String,
  text: String,
  category: String,
  Ideal: [String],
  WhatsIncluded: [String],
  imageUrl: String
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Routes

// Create product
app.post('/api/products', upload.single('image'), async (req, res) => {
  try {
    const { Pname, slug, text, category, Ideal, WhatsIncluded } = req.body;

    const newProduct = new Product({
      Pname,
      slug,
      text,
      category,
      Ideal: Ideal ? Ideal.split(',').map(i => i.trim()) : [],
      WhatsIncluded: WhatsIncluded ? WhatsIncluded.split(',').map(i => i.trim()) : [],
      imageUrl: req.file ? `/uploads/${req.file.filename}` : ''
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Create failed' });
  }
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    if (product.imageUrl) {
      const imgPath = path.join(__dirname, product.imageUrl);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

// Update product
app.put('/api/products/:id', upload.single('image'), async (req, res) => {
  try {
    const { Pname, slug, text, category, Ideal, WhatsIncluded } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    product.Pname = Pname || product.Pname;
    product.slug = slug || product.slug;
    product.text = text || product.text;
    product.category = category || product.category;
    product.Ideal = Ideal ? Ideal.split(',').map(i => i.trim()) : product.Ideal;
    product.WhatsIncluded = WhatsIncluded ? WhatsIncluded.split(',').map(i => i.trim()) : product.WhatsIncluded;

    if (req.file) {
      // Delete old image if exists
      if (product.imageUrl) {
        const oldImg = path.join(__dirname, product.imageUrl);
        if (fs.existsSync(oldImg)) fs.unlinkSync(oldImg);
      }
      product.imageUrl = `/uploads/${req.file.filename}`;
    }

    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
