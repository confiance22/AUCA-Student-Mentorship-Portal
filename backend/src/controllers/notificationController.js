const pool = require('../config/db');
const { sendSuccess, sendError } = require('../utils/helpers');

// Get all notifications for the current user
const getNotifications = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    sendSuccess(res, rows);
  } catch (err) {
    next(err);
  }
};

// Mark a notification as read
const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      'UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.id]
    );
    if (rows.length === 0) return sendError(res, 'Notification not found', 404);
    sendSuccess(res, rows[0]);
  } catch (err) {
    next(err);
  }
};

// Admin only: Get all notifications
const getAllNotifications = async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM notifications ORDER BY created_at DESC');
    sendSuccess(res, rows);
  } catch (err) {
    next(err);
  }
};

module.exports = { getNotifications, markAsRead, getAllNotifications };
