const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount, deliveryCharge } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ message: 'No items in order' });

    // Validate and format items
    const formattedItems = [];
    for (const item of items) {
      const productId = item.product?._id || item.product;
      if (!productId) continue;
      formattedItems.push({
        product: productId,
        name: item.name || 'Product',
        image: item.image || '',
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1
      });
    }

    if (formattedItems.length === 0) {
      return res.status(400).json({ message: 'Invalid items in order' });
    }

    const order = await Order.create({
      user: req.user._id,
      items: formattedItems,
      shippingAddress,
      paymentMethod,
      totalAmount: Number(totalAmount) || 0,
      deliveryCharge: Number(deliveryCharge) || 0
    });

    // Reduce product stock in database
    for (const item of formattedItems) {
      try {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity }
        });
      } catch { /* ignore individual stock update failure */ }
    }

    // Clear cart after order
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/my — user's orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name image price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders — all orders (admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name image price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name image price');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    // Non-admin can only see own orders
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/orders/:id/status (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { ...(orderStatus && { orderStatus }), ...(paymentStatus && { paymentStatus }) },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/stats (admin)
const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const pending = await Order.countDocuments({ orderStatus: 'Processing' });
    const delivered = await Order.countDocuments({ orderStatus: 'Delivered' });
    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      pending,
      delivered
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createOrder, getMyOrders, getAllOrders, getOrderById, updateOrderStatus, getOrderStats };
