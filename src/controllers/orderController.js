const Order = require('../models/Order');
const Cart = require('../models/Cart');

// Create order — accepts items directly from the frontend (sessionStorage cart)
// or falls back to the DB cart if no items are provided in the request body.
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const { items: bodyItems, shippingAddress, paymentMethod = 'card' } = req.body;

    let orderItems;

    if (Array.isArray(bodyItems) && bodyItems.length > 0) {
      // Items passed directly from frontend (sessionStorage cart)
      orderItems = bodyItems;
    } else {
      // Fallback: read from DB cart collection
      const cart = await Cart.findOne({ userId });
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
      }
      orderItems = cart.items;
    }

    // Validate each item has a price
    for (const item of orderItems) {
      if (item.price === undefined || item.price === null) {
        return res.status(400).json({ error: `Item ${item.productId} is missing a price` });
      }
    }

    // Calculate total from item prices
    const total = orderItems.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );

    const order = new Order({
      userId,
      items: orderItems.map(i => ({
        productId:    i.productId,
        productName:  i.productName  || '',
        brand:        i.brand        || '',
        category:     i.category     || '',
        price:        Number(i.price),
        imageUrl:     i.imageUrl     || '',
        selectedSize: i.selectedSize || '',
        quantity:     Number(i.quantity),
      })),
      total,
      status: 'pending',
      shippingAddress: shippingAddress || {},
      paymentMethod,
    });

    await order.save();

    // If items came from DB cart, clear it after placing order
    if (!Array.isArray(bodyItems) || bodyItems.length === 0) {
      const cart = await Cart.findOne({ userId });
      if (cart) { cart.items = []; await cart.save(); }
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single order by ID
exports.getOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const order = await Order.findOne({ _id: req.params.id, userId });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all orders for the logged-in user
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cancel an order (only if still pending)
exports.cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const order = await Order.findOne({ _id: req.params.id, userId });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.status !== 'pending') {
      return res.status(400).json({ error: `Cannot cancel an order with status '${order.status}'` });
    }
    order.status = 'cancelled';
    await order.save();
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

