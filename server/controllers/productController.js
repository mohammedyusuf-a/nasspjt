const Product = require('../models/Product');
const { getProductsData } = require('../data/productsData');

// GET /api/products
const getProducts = async (req, res) => {
  try {
    const { search, category, isLimitedOffer } = req.query;
    let query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (category && category !== 'All') query.category = category;
    if (isLimitedOffer === 'true') query.isLimitedOffer = true;
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/products (admin)
const createProduct = async (req, res) => {
  try {
    const { name, description, price, discount, category, image, stock } = req.body;
    if (!name || !description || !price || !category || !image)
      return res.status(400).json({ message: 'Required fields missing' });
    const product = await Product.create({ name, description, price, discount, category, image, stock });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/products/:id (admin)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/products/:id (admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/products/categories
const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/products/reseed (Reseed 50+ products)
const reseedProducts = async (req, res) => {
  try {
    await Product.deleteMany({});
    const now = Date.now();
    const getOfferTime = (hours) => new Date(now + hours * 3600 * 1000);
    const products = getProductsData(getOfferTime);
    const inserted = await Product.insertMany(products);
    res.json({ message: `Successfully seeded ${inserted.length} products!`, count: inserted.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getCategories, reseedProducts };
