const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  productId:   { type: String, required: true },
  productName: { type: String, default: '' },
  brand:       { type: String, default: '' },
  category:    { type: String, default: '' },
  price:       { type: Number, required: true, default: 0 },
  imageUrl:    { type: String, default: '' },
  selectedSize:{ type: String, default: '' },
  quantity:    { type: Number, required: true, default: 1 },
});

const CartSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  items:  [CartItemSchema],
}, { timestamps: true });

module.exports = mongoose.model('Cart', CartSchema);