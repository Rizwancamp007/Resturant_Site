const Order = require('../models/Order');

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Customer
 */
const createOrder = async (req, res, next) => {
  try {
    const { items, subtotal, tax, deliveryFee, total, paymentMethod, orderType, deliveryAddress, specialInstructions } = req.body;

    if (!items || items.length === 0) {
      res.status(400);
      throw new Error('No items in order');
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      subtotal,
      tax,
      deliveryFee,
      total,
      paymentMethod,
      orderType,
      deliveryAddress,
      specialInstructions,
      statusHistory: [{ status: 'placed', updatedBy: req.user._id }]
    });

    // Emit socket event for kitchen
    const io = req.app.get('io');
    if (io) {
      const populatedOrder = await Order.findById(order._id).populate('user', 'name email phone');
      io.to('kitchen').emit('newOrder', populatedOrder);
    }

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get orders (user's own orders or all for admin/staff)
 * @route   GET /api/orders
 * @access  Authenticated
 */
const getOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};

    // Customers see only their orders; staff/admin see all
    if (req.user.role === 'customer') {
      filter.user = req.user._id;
    }
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const orders = await Order.find(filter)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: orders,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single order
 * @route   GET /api/orders/:id
 * @access  Authenticated
 */
const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // Customers can only see their own orders
    if (req.user.role === 'customer' && order.user._id.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to view this order');
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update order status (staff/admin)
 * @route   PUT /api/orders/:id/status
 * @access  Staff/Admin
 */
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    order.status = status;
    order.statusHistory.push({ status, updatedBy: req.user._id });

    // Set estimated delivery time when confirmed
    if (status === 'confirmed' && !order.estimatedDelivery) {
      order.estimatedDelivery = new Date(Date.now() + 45 * 60 * 1000); // 45 min default
    }

    await order.save();

    // Emit socket event for real-time tracking
    const io = req.app.get('io');
    if (io) {
      io.to(`order_${order._id}`).emit('orderStatusUpdate', {
        orderId: order._id,
        status: order.status,
        statusHistory: order.statusHistory
      });
      io.to('kitchen').emit('orderUpdated', { orderId: order._id, status });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel order (customer — only if still 'placed')
 * @route   PUT /api/orders/:id/cancel
 * @access  Customer
 */
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    if (order.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized');
    }

    if (order.status !== 'placed') {
      res.status(400);
      throw new Error('Order can only be cancelled when status is "placed"');
    }

    order.status = 'cancelled';
    order.statusHistory.push({ status: 'cancelled', updatedBy: req.user._id });
    await order.save();

    const io = req.app.get('io');
    if (io) {
      io.to('kitchen').emit('orderCancelled', { orderId: order._id });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get order analytics (admin)
 * @route   GET /api/orders/analytics
 * @access  Admin
 */
const getOrderAnalytics = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const revenueByDay = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' }, createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$total' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const topItems = await Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.name', totalOrdered: { $sum: '$items.quantity' }, revenue: { $sum: '$items.itemTotal' } } },
      { $sort: { totalOrdered: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        ordersByStatus,
        revenueByDay,
        topItems
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getOrders, getOrder, updateOrderStatus, cancelOrder, getOrderAnalytics };
