const express = require('express');
const router = express.Router();
const { createReservation, getReservations, checkAvailability, updateReservation, cancelReservation } = require('../controllers/reservationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/availability', checkAvailability);
router.post('/', protect, createReservation);
router.get('/', protect, getReservations);
router.put('/:id', protect, authorize('staff', 'admin'), updateReservation);
router.delete('/:id', protect, cancelReservation);

module.exports = router;
