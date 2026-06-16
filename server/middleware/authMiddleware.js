const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes — verifies JWT access token
 */
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized — no token'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      res.status(401);
      return next(new Error('Not authorized — user not found'));
    }

    next();
  } catch (error) {
    res.status(401);
    next(new Error('Not authorized — invalid token'));
  }
};

/**
 * Authorize by role — restricts access to specific roles
 * @param  {...string} roles - Allowed roles (e.g. 'admin', 'staff')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403);
      return next(new Error(`Role '${req.user.role}' is not authorized to access this route`));
    }
    next();
  };
};

module.exports = { protect, authorize };
