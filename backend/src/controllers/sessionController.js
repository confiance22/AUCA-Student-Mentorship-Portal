// ============================================================
// Session Controller
// ============================================================
const Session = require('../models/Session');
const MentorProfile = require('../models/MentorProfile');
const { sendSuccess, sendError } = require('../utils/helpers');
const db = require('../config/db');

/** POST /api/sessions — Mentee books a session */
const bookSession = async (req, res, next) => {
  try {
    const { mentor_id, title, description, scheduled_at, duration_minutes, meeting_link } = req.body;
    if (!mentor_id || !title || !scheduled_at)
      return sendError(res, 'mentor_id, title and scheduled_at are required', 400);

    // Verify mentor is approved
    const profile = await MentorProfile.findByUserId(mentor_id);
    if (!profile || profile.approval_status !== 'approved')
      return sendError(res, 'Mentor is not approved', 403);

    const session = await Session.create({
      mentor_id,
      mentee_id: req.user.id,
      title,
      description,
      scheduled_at,
      duration_minutes,
      meeting_link,
    });
    
    // Notify the mentor
    await db.query(
      'INSERT INTO notifications (user_id, message) VALUES ($1, $2)',
      [mentor_id, `New session booked: ${title}`]
    );

    sendSuccess(res, session, 'Session booked', 201);
  } catch (err) { next(err); }
};

/** GET /api/sessions — Get sessions for logged-in user */
const getMySessions = async (req, res, next) => {
  try {
    let sessions;
    if (req.user.role === 'mentor')
      sessions = await Session.getByMentor(req.user.id);
    else if (req.user.role === 'mentee')
      sessions = await Session.getByMentee(req.user.id);
    else
      sessions = await Session.getAll(); // admin
    sendSuccess(res, sessions);
  } catch (err) { next(err); }
};

/** PATCH /api/sessions/:id/status — Mentor accepts/declines, or completes */
const updateSessionStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['accepted', 'declined', 'completed', 'cancelled'];
    if (!allowed.includes(status))
      return sendError(res, 'Invalid status', 400);

    const session = await Session.findById(parseInt(req.params.id));
    if (!session) return sendError(res, 'Session not found', 404);

    // Only the mentor can accept/decline; only admin/mentor can complete
    if (['accepted', 'declined'].includes(status) && session.mentor_id !== req.user.id)
      return sendError(res, 'Only the mentor can accept or decline', 403);

    const updated = await Session.updateStatus(session.id, status);

    // Notify the mentee
    await db.query(
      'INSERT INTO notifications (user_id, message) VALUES ($1, $2)',
      [session.mentee_id, `Your session "${session.title}" was ${status}`]
    );

    sendSuccess(res, updated, `Session ${status}`);
  } catch (err) { next(err); }
};

/** DELETE /api/sessions/:id — Delete session (admin) */
const deleteSession = async (req, res, next) => {
  try {
    const success = await Session.delete(parseInt(req.params.id));
    if (!success) return sendError(res, 'Session not found', 404);
    sendSuccess(res, null, 'Session deleted successfully');
  } catch (err) { next(err); }
};

module.exports = { bookSession, getMySessions, updateSessionStatus, deleteSession };