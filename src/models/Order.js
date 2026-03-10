const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  productId:   { type: String, required: true },
  productName: { type: String, default: '' },
  brand:       { type: String, default: '' },
  category:    { type: String, default: '' },
  price:       { type: Number, required: true, default: 0 },
  imageUrl:    { type: String, default: '' },
  selectedSize:{ type: String, default: '' },
  quantity:    { type: Number, required: true },
});

const ShippingAddressSchema = new mongoose.Schema({
  fullName:  { type: String, default: '' },
  address:   { type: String, default: '' },
  city:      { type: String, default: '' },
  postalCode:{ type: String, default: '' },
  phone:     { type: String, default: '' },
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  userId:          { type: String, required: true },
  items:           [OrderItemSchema],
  total:           { type: Number, required: true },
  status:          { type: String, default: 'pending', enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] },
  shippingAddress: { type: ShippingAddressSchema, default: {} },
  paymentMethod:   { type: String, default: 'card' },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);