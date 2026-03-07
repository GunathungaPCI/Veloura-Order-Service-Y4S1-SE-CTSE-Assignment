const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const orderController = require('../controllers/orderController');


// Cart routes

router.post('/cart/add', cartController.addToCart);
router.get('/cart', cartController.getCart);
router.put('/cart/update', cartController.updateCartItem);
router.delete('/cart/remove', cartController.removeCartItem);

// Order routes

router.post('/order/create', orderController.createOrder);
router.get('/order/:id', orderController.getOrder);

module.exports = router;
