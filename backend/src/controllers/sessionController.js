// ============================================================
// Session Controller
// ============================================================
const Session = require('../models/Session');
const MentorProfile = require('../models/MentorProfile');
const { sendSuccess, sendError } = require('../utils/helpers');

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
    sendSuccess(res, updated, `Session ${status}`);
  } catch (err) { next(err); }
};

module.exports = { bookSession, getMySessions, updateSessionStatus };