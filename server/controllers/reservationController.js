const Reservation = require('../models/Reservation');

// Total tables available in the restaurant
const TOTAL_TABLES = 15;
const MAX_RESERVATIONS_PER_SLOT = TOTAL_TABLES;

/**
 * @desc    Create reservation
 * @route   POST /api/reservations
 * @access  Customer
 */
const createReservation = async (req, res, next) => {
  try {
    const { date, timeSlot, guests, specialRequests, contactPhone } = req.body;

    // Check availability
    const existingCount = await Reservation.countDocuments({
      date: new Date(date),
      timeSlot,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingCount >= MAX_RESERVATIONS_PER_SLOT) {
      res.status(400);
      throw new Error('This time slot is fully booked. Please choose another time.');
    }

    // Auto-assign table number
    const takenTables = await Reservation.find({
      date: new Date(date),
      timeSlot,
      status: { $in: ['pending', 'confirmed'] }
    }).select('tableNumber');

    const takenNums = takenTables.map(r => r.tableNumber);
    let assignedTable = null;
    for (let i = 1; i <= TOTAL_TABLES; i++) {
      if (!takenNums.includes(i)) { assignedTable = i; break; }
    }

    const reservation = await Reservation.create({
      user: req.user._id,
      date: new Date(date),
      timeSlot,
      guests,
      tableNumber: assignedTable,
      specialRequests,
      contactPhone
    });

    res.status(201).json({ success: true, data: reservation });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get reservations
 * @route   GET /api/reservations
 * @access  Authenticated
 */
const getReservations = async (req, res, next) => {
  try {
    const { date, status, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (req.user.role === 'customer') filter.user = req.user._id;
    if (date) filter.date = new Date(date);
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const reservations = await Reservation.find(filter)
      .populate('user', 'name email phone')
      .sort({ date: 1, timeSlot: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Reservation.countDocuments(filter);

    res.json({
      success: true,
      data: reservations,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Check time slot availability
 * @route   GET /api/reservations/availability
 * @access  Public
 */
const checkAvailability = async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date) {
      res.status(400);
      throw new Error('Date is required');
    }

    const allSlots = [
      '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
      '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
      '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM',
      '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM',
      '09:00 PM', '09:30 PM'
    ];

    const reservations = await Reservation.aggregate([
      { $match: { date: new Date(date), status: { $in: ['pending', 'confirmed'] } } },
      { $group: { _id: '$timeSlot', count: { $sum: 1 } } }
    ]);

    const slotMap = {};
    reservations.forEach(r => { slotMap[r._id] = r.count; });

    const availability = allSlots.map(slot => ({
      timeSlot: slot,
      booked: slotMap[slot] || 0,
      available: MAX_RESERVATIONS_PER_SLOT - (slotMap[slot] || 0),
      isFull: (slotMap[slot] || 0) >= MAX_RESERVATIONS_PER_SLOT
    }));

    res.json({ success: true, data: availability });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update reservation status
 * @route   PUT /api/reservations/:id
 * @access  Staff/Admin
 */
const updateReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!reservation) {
      res.status(404);
      throw new Error('Reservation not found');
    }
    res.json({ success: true, data: reservation });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel reservation
 * @route   DELETE /api/reservations/:id
 * @access  Customer/Admin
 */
const cancelReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      res.status(404);
      throw new Error('Reservation not found');
    }

    if (req.user.role === 'customer' && reservation.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized');
    }

    reservation.status = 'cancelled';
    await reservation.save();

    res.json({ success: true, message: 'Reservation cancelled' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createReservation, getReservations, checkAvailability, updateReservation, cancelReservation };
