const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const orderController = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');

// Cart routes — require a logged-in user
router.post('/cart/add',      authenticate, cartController.addToCart);
router.get('/cart',           authenticate, cartController.getCart);
router.put('/cart/update',    authenticate, cartController.updateCartItem);
router.delete('/cart/remove', authenticate, cartController.removeCartItem);
router.delete('/cart/clear',  authenticate, cartController.clearCart);

// Order routes — require a logged-in user
router.post('/orders',              authenticate, orderController.createOrder);
router.get('/orders',               authenticate, orderController.getUserOrders);
router.get('/orders/:id',           authenticate, orderController.getOrder);
router.patch('/orders/:id/cancel',  authenticate, orderController.cancelOrder);

// Legacy routes kept for backward compatibility
router.post('/order/create', authenticate, orderController.createOrder);
router.get('/order/:id',     authenticate, orderController.getOrder);

module.exports = router;

