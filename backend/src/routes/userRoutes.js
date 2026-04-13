const express = require('express');
const router = express.Router();
const { getMentors, getPendingMentors, approveMentor, getAllUsers, updateProfile } = require('../controllers/userController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

router.get('/mentors',        authenticate, getMentors);
router.get('/pending',        authenticate, authorize('admin'), getPendingMentors);
router.get('/',               authenticate, authorize('admin'), getAllUsers);
router.patch('/:id/approve',  authenticate, authorize('admin'), approveMentor);
router.put('/profile',        authenticate, updateProfile);

module.exports = router;