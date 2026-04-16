const express = require('express');
const router = express.Router();
const { submitFeedback, getMentorFeedback, getAllFeedback } = require('../controllers/feedbackController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

router.post('/',              authenticate, authorize('mentee'), submitFeedback);
router.get('/mentor/:id',     authenticate, getMentorFeedback); 
router.get('/',               authenticate, authorize('admin'), getAllFeedback);

module.exports = router;