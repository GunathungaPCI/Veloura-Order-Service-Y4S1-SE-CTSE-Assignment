const Order = require('../models/Order');
const Cart = require('../models/Cart');

// Create order from cart (Pay Now)
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user?.id || "507f1f77bcf86cd799439011";
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    // Calculate total (in real app, fetch product prices from Product Service)
    const total = cart.items.reduce((sum, item) => sum + (item.quantity * 100), 0); // Placeholder price
    const order = new Order({
      userId,
      items: cart.items,
      total,
      status: 'pending',
    });
    await order.save();
    // Optionally clear cart after order
    cart.items = [];
    await cart.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get order details
exports.getOrder = async (req, res) => {
  try {
    const userId = req.user?.id || "507f1f77bcf86cd799439011";
    const orderId = req.params.id;
    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
