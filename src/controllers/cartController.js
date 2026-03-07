const Cart = require('../models/Cart');

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user?.id || "507f1f77bcf86cd799439011";
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, quantity }] });
    } else {
      const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }
    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user?.id || "507f1f77bcf86cd799439011";
    const cart = await Cart.findOne({ userId });
    res.status(200).json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user?.id || "507f1f77bcf86cd799439011";
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    const item = cart.items.find(item => item.productId.equals(productId));
    if (!item) return res.status(404).json({ error: 'Item not found in cart' });
    item.quantity = quantity;
    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove item from cart
exports.removeCartItem = async (req, res) => {
  try {
    const userId = req.user?.id || "507f1f77bcf86cd799439011";
    const { productId } = req.body;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    cart.items = cart.items.filter(item => !item.productId.equals(productId));
    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
