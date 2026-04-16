// ============================================================
// Feedback Controller
// ============================================================
const Feedback = require('../models/Feedback');
const Session = require('../models/Session');
const { sendSuccess, sendError } = require('../utils/helpers');

const submitFeedback = async (req, res, next) => {
  try {
    const { session_id, rating, review } = req.body;
    if (!session_id || !rating)
      return sendError(res, 'session_id and rating are required', 400);

    const session = await Session.findById(parseInt(session_id)); // ← parse to int
    if (!session) return sendError(res, 'Session not found', 404);
    if (session.status !== 'completed')
      return sendError(res, 'Can only review completed sessions', 403);

    // Explicit parseInt on both sides prevents type mismatch
    if (parseInt(session.mentee_id) !== parseInt(req.user.id))
      return sendError(res, 'Only the mentee can leave feedback', 403);

    const existing = await Feedback.findBySession(parseInt(session_id));
    if (existing) return sendError(res, 'Feedback already submitted', 409);

    const feedback = await Feedback.create({
      session_id: parseInt(session_id),
      mentee_id:  parseInt(req.user.id),
      mentor_id:  parseInt(session.mentor_id), // ← comes from the session, correct mentor
      rating:     parseInt(rating),
      review,
    });
    sendSuccess(res, feedback, 'Feedback submitted', 201);
  } catch (err) { next(err); }
};

/** GET /api/feedback/mentor/:id — Get feedback for a mentor */
const getMentorFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.getByMentor(parseInt(req.params.id));
    sendSuccess(res, feedback);
  } catch (err) { next(err); }
};

/** GET /api/feedback — All feedback (admin) */
const getAllFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.getAll();
    sendSuccess(res, feedback);
  } catch (err) { next(err); }
};

module.exports = { submitFeedback, getMentorFeedback, getAllFeedback };