const express = require('express');
const router = express.Router();
const { submitPayment, verifyPayment, getPaymentDetails } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/details', getPaymentDetails);
router.post('/submit', protect, upload.single('screenshot'), submitPayment);
router.put('/:orderId/verify', protect, authorize('admin'), verifyPayment);

module.exports = router;
