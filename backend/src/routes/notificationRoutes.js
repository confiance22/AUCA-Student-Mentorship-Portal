const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, getAllNotifications } = require('../controllers/notificationController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

router.get('/', authenticate, getNotifications);
router.get('/all', authenticate, authorize('admin'), getAllNotifications);
router.patch('/:id/read', authenticate, markAsRead);

module.exports = router;
