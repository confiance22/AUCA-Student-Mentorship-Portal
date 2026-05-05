// ============================================================
// User Controller — profile, mentor approvals
// ============================================================
const User = require('../models/User');
const MentorProfile = require('../models/MentorProfile');
const { sendSuccess, sendError } = require('../utils/helpers');
const db = require('../config/db');

/** GET /api/users/mentors — Approved mentors list */
const getMentors = async (req, res, next) => {
  try {
    const mentors = await MentorProfile.getApproved();
    sendSuccess(res, mentors);
  } catch (err) { next(err); }
};

/** GET /api/users/pending — Pending mentor applications (admin) */
const getPendingMentors = async (req, res, next) => {
  try {
    const pending = await MentorProfile.getPending();
    sendSuccess(res, pending);
  } catch (err) { next(err); }
};

/** PATCH /api/users/:id/approve — Approve or reject mentor (admin) */
const approveMentor = async (req, res, next) => {
  try {
    const { status } = req.body; // 'approved' | 'rejected'
    if (!['approved', 'rejected'].includes(status))
      return sendError(res, 'Status must be approved or rejected', 400);

    const profile = await MentorProfile.updateStatus(
      parseInt(req.params.id),
      status,
      req.user.id
    );
    if (!profile) return sendError(res, 'Mentor not found', 404);

    // Notify the mentor
    await db.query(
      'INSERT INTO notifications (user_id, message) VALUES ($1, $2)',
      [profile.user_id, `Your mentor application has been ${status}`]
    );

    sendSuccess(res, profile, `Mentor ${status}`);
  } catch (err) { next(err); }
};

/** GET /api/users — All users (admin) */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.getAll();
    sendSuccess(res, users);
  } catch (err) { next(err); }
};

/** PUT /api/users/profile — Update own profile */
const updateProfile = async (req, res, next) => {
  try {
    const { name, bio } = req.body;
    const updated = await User.update(req.user.id, { name, bio });
    sendSuccess(res, updated, 'Profile updated');
  } catch (err) { next(err); }
};

/** DELETE /api/users/:id — Delete user (admin) */
const deleteUser = async (req, res, next) => {
  try {
    const success = await User.delete(parseInt(req.params.id));
    if (!success) return sendError(res, 'User not found', 404);
    sendSuccess(res, null, 'User deleted successfully');
  } catch (err) { next(err); }
};

module.exports = { getMentors, getPendingMentors, approveMentor, getAllUsers, updateProfile, deleteUser };