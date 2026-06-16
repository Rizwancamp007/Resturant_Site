const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrder, updateOrderStatus, cancelOrder, getOrderAnalytics } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/analytics', protect, authorize('admin'), getOrderAnalytics);
router.post('/', protect, createOrder);
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, authorize('staff', 'admin'), updateOrderStatus);
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;
