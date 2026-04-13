// ============================================================
// Utility helpers
// ============================================================
const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT token
 */
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'auca_secret_2025',
    { expiresIn: '7d' }
  );
};

/**
 * Standard success response
 */
const sendSuccess = (res, data, message = 'Success', status = 200) => {
  res.status(status).json({ success: true, message, data });
};

/**
 * Standard error response
 */
const sendError = (res, message = 'Server Error', status = 500) => {
  res.status(status).json({ success: false, message });
};

module.exports = { generateToken, sendSuccess, sendError };