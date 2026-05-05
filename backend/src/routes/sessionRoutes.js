const express = require('express');
const router = express.Router();
const { bookSession, getMySessions, updateSessionStatus, deleteSession } = require('../controllers/sessionController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

router.post('/',              authenticate, authorize('mentee'), bookSession);
router.get('/',               authenticate, getMySessions);
router.patch('/:id/status',   authenticate, updateSessionStatus);
router.delete('/:id',         authenticate, authorize('admin'), deleteSession);

module.exports = router;