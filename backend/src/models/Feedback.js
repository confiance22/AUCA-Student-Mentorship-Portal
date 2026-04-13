// ============================================================
// Feedback Model
// ============================================================
const db = require('../config/db');

const Feedback = {
  /** Submit feedback for a completed session */
  create: async ({ session_id, mentee_id, mentor_id, rating, review }) => {
    const { rows } = await db.query(
      `INSERT INTO feedback (session_id, mentee_id, mentor_id, rating, review)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [session_id, mentee_id, mentor_id, rating, review]
    );
    return rows[0];
  },

  /** Check if feedback already submitted for a session */
  findBySession: async (session_id) => {
    const { rows } = await db.query(
      'SELECT * FROM feedback WHERE session_id = $1',
      [session_id]
    );
    return rows[0];
  },

  /** Get all feedback for a mentor */
  getByMentor: async (mentor_id) => {
    const { rows } = await db.query(`
      SELECT f.*, u.name AS mentee_name, s.title AS session_title
      FROM feedback f
      JOIN users u ON u.id = f.mentee_id
      JOIN sessions s ON s.id = f.session_id
      WHERE f.mentor_id = $1
      ORDER BY f.created_at DESC
    `, [mentor_id]);
    return rows;
  },

  /** Get all feedback (admin) */
  getAll: async () => {
    const { rows } = await db.query(`
      SELECT f.*, 
             u.name AS mentee_name,
             m.name AS mentor_name,
             s.title AS session_title
      FROM feedback f
      JOIN users u ON u.id = f.mentee_id
      JOIN users m ON m.id = f.mentor_id
      JOIN sessions s ON s.id = f.session_id
      ORDER BY f.created_at DESC
    `);
    return rows;
  },
};

module.exports = Feedback;