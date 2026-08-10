require('dns').setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter(Boolean);
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));

app.get('/', (req, res) => res.json({ message: 'ShopEZ API is running 🚀' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// ─── Seeders ─────────────────────────────────────────────────────────────────
const User = require('./models/User');
const Product = require('./models/Product');
const { getProductsData } = require('./data/productsData');

const seedAdmin = async () => {
  const admin = await User.findOne({ email: 'admin@gmail.com' });
  if (!admin) {
    const hashed = await bcrypt.hash('admin123', 10);
    await User.create({ name: 'Admin', email: 'admin@gmail.com', password: hashed, role: 'admin' });
    console.log('✅ Admin account seeded  →  admin@gmail.com / admin123');
  }
};

const seedProducts = async (force = false) => {
  const count = await Product.countDocuments();
  const now = Date.now();
  const getOfferTime = (hours) => new Date(now + hours * 3600 * 1000);
  const products = getProductsData(getOfferTime);

  if (count === 0 || force) {
    if (force) await Product.deleteMany({});
    await Product.insertMany(products);
    console.log(`✅ ${products.length} products successfully seeded into database!`);
  } else {
    // Update existing products with new luxury prices and attributes
    for (const p of products) {
      await Product.updateOne({ name: p.name }, { $set: { price: p.price, discount: p.discount, image: p.image, category: p.category, description: p.description } });
    }
    console.log(`✅ ${products.length} product prices & details updated in database!`);
  }
};

// ─── Connect & Start ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shopez';

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');
    await seedAdmin();
    await seedProducts(true); // force re-seed luxury product prices
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
