const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Reservation date is required']
  },
  timeSlot: {
    type: String,
    required: [true, 'Time slot is required'],
    enum: [
      '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
      '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
      '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM',
      '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM',
      '09:00 PM', '09:30 PM'
    ]
  },
  guests: {
    type: Number,
    required: [true, 'Number of guests is required'],
    min: [1, 'At least 1 guest required'],
    max: [20, 'Maximum 20 guests per reservation']
  },
  tableNumber: {
    type: Number,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no_show'],
    default: 'pending'
  },
  specialRequests: {
    type: String,
    maxlength: [300, 'Special requests cannot exceed 300 characters']
  },
  contactPhone: {
    type: String
  }
}, {
  timestamps: true
});

// Compound index for availability checking
reservationSchema.index({ date: 1, timeSlot: 1, status: 1 });

module.exports = mongoose.model('Reservation', reservationSchema);
