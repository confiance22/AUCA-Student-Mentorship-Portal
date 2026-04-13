// ============================================================
// Auth Controller — Register & Login
// ============================================================
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const MentorProfile = require('../models/MentorProfile');
const { generateToken, sendSuccess, sendError } = require('../utils/helpers');

/**
 * POST /api/auth/register
 * Registers mentee or mentor. Admin is pre-seeded.
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, bio, expertise, department, year_of_study, availability } = req.body;

    if (!name || !email || !password || !role)
      return sendError(res, 'Name, email, password and role are required', 400);

    if (!['mentee', 'mentor'].includes(role))
      return sendError(res, 'Role must be mentee or mentor', 400);

    // Check duplicate email
    const existing = await User.findByEmail(email);
    if (existing) return sendError(res, 'Email already registered', 409);

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password_hash, role, bio });

    // If mentor, create a pending profile
    if (role === 'mentor') {
      await MentorProfile.create({
        user_id: user.id,
        expertise: expertise || [],
        department,
        year_of_study,
        availability,
      });
    }

    const token = generateToken(user.id, user.role);
    sendSuccess(res, { user, token }, 'Registration successful', 201);
  } catch (err) {
    next(err);
  }
};



/**
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);

    if (!user) return sendError(res, 'Invalid credentials', 401);

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) return sendError(res, 'Invalid credentials', 401);

    const token = generateToken(user.id, user.role);
    const { password_hash, ...safeUser } = user;

    sendSuccess(res, { user: safeUser, token }, 'Login successful');
  } catch (err) {
    next(err);
  }
};


/**
 * GET /api/auth/me
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    sendSuccess(res, user);
  } catch (err) {
    next(err);
  }
};


module.exports = { register, login, getMe };