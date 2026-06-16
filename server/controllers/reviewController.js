const Review = require('../models/Review');

const getReviews = async (req, res, next) => {
  try {
    const { menuItem, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (menuItem) filter.menuItem = menuItem;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const reviews = await Review.find(filter).populate('user', 'name avatar').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    const total = await Review.countDocuments(filter);
    res.json({ success: true, data: reviews, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) { next(error); }
};

const createReview = async (req, res, next) => {
  try {
    const { menuItem, rating, comment } = req.body;
    const existing = await Review.findOne({ user: req.user._id, menuItem });
    if (existing) { res.status(400); throw new Error('You have already reviewed this item'); }
    const review = await Review.create({ user: req.user._id, menuItem, rating, comment });
    res.status(201).json({ success: true, data: review });
  } catch (error) { next(error); }
};

const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) { res.status(404); throw new Error('Review not found'); }
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') { res.status(403); throw new Error('Not authorized'); }
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) { next(error); }
};

module.exports = { getReviews, createReview, deleteReview };
