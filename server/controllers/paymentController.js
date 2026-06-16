const Order = require('../models/Order');

const submitPayment = async (req, res, next) => {
  try {
    const { orderId, transactionId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) { res.status(404); throw new Error('Order not found'); }
    if (order.user.toString() !== req.user._id.toString()) { res.status(403); throw new Error('Not authorized'); }

    order.transactionId = transactionId || '';
    order.paymentStatus = 'submitted';
    if (req.file) order.paymentScreenshot = `/uploads/${req.file.filename}`;
    await order.save();

    const io = req.app.get('io');
    if (io) io.to('admin').emit('paymentSubmitted', { orderId: order._id, orderNumber: order.orderNumber, paymentMethod: order.paymentMethod, transactionId });

    res.json({ success: true, data: order });
  } catch (error) { next(error); }
};

const verifyPayment = async (req, res, next) => {
  try {
    const { action } = req.body;
    const order = await Order.findById(req.params.orderId);
    if (!order) { res.status(404); throw new Error('Order not found'); }

    order.paymentStatus = action === 'verify' ? 'verified' : 'rejected';
    if (action === 'verify' && order.status === 'placed') {
      order.status = 'confirmed';
      order.statusHistory.push({ status: 'confirmed', updatedBy: req.user._id });
    }
    await order.save();

    const io = req.app.get('io');
    if (io) io.to(`order_${order._id}`).emit('paymentUpdate', { orderId: order._id, paymentStatus: order.paymentStatus, orderStatus: order.status });

    res.json({ success: true, data: order });
  } catch (error) { next(error); }
};

const getPaymentDetails = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: {
        jazzcash: { accountName: process.env.JAZZCASH_ACCOUNT_NAME || 'Lahore Traditional', accountNumber: process.env.JAZZCASH_ACCOUNT_NUMBER || '03XXXXXXXXX' },
        easypaisa: { accountName: process.env.EASYPAISA_ACCOUNT_NAME || 'Lahore Traditional', accountNumber: process.env.EASYPAISA_ACCOUNT_NUMBER || '03XXXXXXXXX' },
        bankTransfer: { bankName: process.env.BANK_NAME || 'Your Bank', accountTitle: process.env.BANK_ACCOUNT_TITLE || 'Lahore Traditional', accountNumber: process.env.BANK_ACCOUNT_NUMBER || 'XXXXXXXXXXXX', iban: process.env.BANK_IBAN || 'PK00XXXX0000000000000000' }
      }
    });
  } catch (error) { next(error); }
};

module.exports = { submitPayment, verifyPayment, getPaymentDetails };
