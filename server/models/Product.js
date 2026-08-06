const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0, min: 0, max: 100 },
  category: { type: String, required: true, trim: true },
  image: { type: String, required: true },
  stock: { type: Number, default: 100, min: 0 },
  rating: { type: Number, default: 4.0, min: 0, max: 5 },
  reviews: { type: Number, default: 0 },
  isLimitedOffer: { type: Boolean, default: false },
  offerEndsAt: { type: Date, default: null },
  claimedPercentage: { type: Number, default: 0, min: 0, max: 100 }
}, { timestamps: true });

productSchema.virtual('discountedPrice').get(function () {
  return +(this.price * (1 - this.discount / 100)).toFixed(2);
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
