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
    const { name, description, price, discount, category, image, stock, rating, reviews } = req.body;
    if (!name || !description || price === undefined || price === null || price === '' || !category || !image)
      return res.status(400).json({ message: 'Required fields missing: name, description, price, category, image' });

    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice < 0) {
      return res.status(400).json({ message: 'Price must be a valid non-negative number' });
    }

    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price: numPrice,
      discount: isNaN(Number(discount)) ? 0 : Number(discount),
      category: category.trim(),
      image: image.trim(),
      stock: isNaN(Number(stock)) ? 100 : Number(stock),
      rating: isNaN(Number(rating)) ? 4.0 : Number(rating),
      reviews: isNaN(Number(reviews)) ? 0 : Number(reviews)
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/products/:id (admin)
const updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.price !== undefined) updateData.price = isNaN(Number(updateData.price)) ? 0 : Number(updateData.price);
    if (updateData.discount !== undefined) updateData.discount = isNaN(Number(updateData.discount)) ? 0 : Number(updateData.discount);
    if (updateData.stock !== undefined) updateData.stock = isNaN(Number(updateData.stock)) ? 100 : Number(updateData.stock);
    if (updateData.rating !== undefined) updateData.rating = isNaN(Number(updateData.rating)) ? 4.0 : Number(updateData.rating);
    if (updateData.reviews !== undefined) updateData.reviews = isNaN(Number(updateData.reviews)) ? 0 : Number(updateData.reviews);

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
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
