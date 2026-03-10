const Cart = require('../models/Cart');

// Add item to cart (or increase quantity if same product+size already present)
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const { productId, productName, brand, category, price, imageUrl, selectedSize, quantity = 1 } = req.body;
    if (!productId || price === undefined) {
      return res.status(400).json({ error: 'productId and price are required' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, productName, brand, category, price, imageUrl, selectedSize, quantity }],
      });
    } else {
      const idx = cart.items.findIndex(
        item => item.productId === productId && item.selectedSize === selectedSize
      );
      if (idx > -1) {
        cart.items[idx].quantity += quantity;
        // Refresh details in case they changed
        cart.items[idx].price = price;
        cart.items[idx].productName = productName;
        cart.items[idx].imageUrl = imageUrl;
      } else {
        cart.items.push({ productId, productName, brand, category, price, imageUrl, selectedSize, quantity });
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
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });
    res.status(200).json(cart || { userId, items: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update item quantity (by productId + selectedSize)
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;

    const { productId, selectedSize, quantity } = req.body;
    if (quantity < 1) return res.status(400).json({ error: 'Quantity must be at least 1' });

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const item = cart.items.find(
      i => i.productId === productId && i.selectedSize === selectedSize
    );
    if (!item) return res.status(404).json({ error: 'Item not found in cart' });

    item.quantity = quantity;
    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove item from cart (by productId + selectedSize)
exports.removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;

    const { productId, selectedSize } = req.body;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.items = cart.items.filter(
      i => !(i.productId === productId && i.selectedSize === selectedSize)
    );
    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Clear entire cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.status(200).json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

