const MenuItem = require('../models/MenuItem');

/**
 * @desc    Get all menu items (with filters)
 * @route   GET /api/menu
 * @access  Public
 */
const getMenuItems = async (req, res, next) => {
  try {
    const { category, dietary, search, available, featured, sort, page = 1, limit = 50 } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (available !== undefined) filter.isAvailable = available === 'true';
    if (featured) filter.featured = featured === 'true';
    if (dietary) filter.dietaryTags = { $in: dietary.split(',') };
    if (search) filter.$text = { $search: search };

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'name') sortOption = { name: 1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const items = await MenuItem.find(filter).sort(sortOption).skip(skip).limit(parseInt(limit));
    const total = await MenuItem.countDocuments(filter);

    // Group by category for frontend convenience
    const categories = await MenuItem.distinct('category');

    res.json({
      success: true,
      data: items,
      categories,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single menu item
 * @route   GET /api/menu/:id
 * @access  Public
 */
const getMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error('Menu item not found');
    }
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create menu item
 * @route   POST /api/menu
 * @access  Admin
 */
const createMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update menu item
 * @route   PUT /api/menu/:id
 * @access  Admin
 */
const updateMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!item) {
      res.status(404);
      throw new Error('Menu item not found');
    }
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete menu item
 * @route   DELETE /api/menu/:id
 * @access  Admin
 */
const deleteMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error('Menu item not found');
    }
    res.json({ success: true, message: 'Menu item deleted' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload menu item image
 * @route   POST /api/menu/:id/image
 * @access  Admin
 */
const uploadMenuImage = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('Please upload an image');
    }

    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error('Menu item not found');
    }

    item.image = `/uploads/${req.file.filename}`;
    await item.save();

    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMenuItems, getMenuItem, createMenuItem, updateMenuItem, deleteMenuItem, uploadMenuImage };
