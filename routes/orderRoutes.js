const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../controllers/authController');
const {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder
} = require('../controllers/orderController');

router.route('/')
  .post(ensureAuthenticated, createOrder)
  .get(ensureAuthenticated, getAllOrders);

router.route('/showAllMyOrders').get(ensureAuthenticated, getCurrentUserOrders);

router.route('/:id')
  .get(ensureAuthenticated, getSingleOrder)
  .patch(ensureAuthenticated, updateOrder);

module.exports = router;
