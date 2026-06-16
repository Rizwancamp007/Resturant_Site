const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: [500, 'Review cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// One review per user per item
reviewSchema.index({ user: 1, menuItem: 1 }, { unique: true });

// Static method to calculate average rating
reviewSchema.statics.calcAverageRating = async function(menuItemId) {
  const stats = await this.aggregate([
    { $match: { menuItem: menuItemId } },
    { $group: { _id: '$menuItem', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);

  const MenuItem = require('./MenuItem');
  if (stats.length > 0) {
    await MenuItem.findByIdAndUpdate(menuItemId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      totalReviews: stats[0].count
    });
  } else {
    await MenuItem.findByIdAndUpdate(menuItemId, { rating: 0, totalReviews: 0 });
  }
};

// Recalculate after save/remove
reviewSchema.post('save', function() {
  this.constructor.calcAverageRating(this.menuItem);
});
reviewSchema.post('findOneAndDelete', function(doc) {
  if (doc) doc.constructor.calcAverageRating(doc.menuItem);
});

module.exports = mongoose.model('Review', reviewSchema);
