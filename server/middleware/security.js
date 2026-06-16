const rateLimit = require('express-rate-limit');

/**
 * Custom NoSQL Injection Prevention Middleware
 * Recursively removes keys starting with '$' or containing '.' from object keys
 */
const mongoSanitize = (req, res, next) => {
  const sanitize = (obj) => {
    if (obj instanceof Object) {
      for (const key in obj) {
        if (/^\$/.test(key) || /\./.test(key)) {
          delete obj[key];
        } else {
          sanitize(obj[key]);
        }
      }
    }
  };

  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);
  
  next();
};

/**
 * Custom XSS Prevention / HTML Sanitizer Middleware
 * Recursively strips potential HTML tag inputs or encodes them
 */
const xssClean = (req, res, next) => {
  const clean = (val) => {
    if (typeof val === 'string') {
      // Escape HTML entities to prevent script injection
      return val
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    }
    if (val instanceof Object) {
      for (const key in val) {
        val[key] = clean(val[key]);
      }
    }
    return val;
  };

  if (req.body) req.body = clean(req.body);
  if (req.query) req.query = clean(req.query);
  if (req.params) req.params = clean(req.params);

  next();
};

/**
 * Express Rate Limiting Configuration
 */
const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: 429,
    message: 'Too many requests from this IP address. Please try again after 15 minutes.'
  }
});

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 authentication/login attempts
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many login attempts. Please try again after 15 minutes to secure your account.'
  }
});

module.exports = {
  mongoSanitize,
  xssClean,
  globalRateLimiter,
  authRateLimiter
};
