// ============================================================
// Session Model
// ============================================================
const db = require('../config/db');

const Session = {
  /** Book a new session */
  create: async ({ mentor_id, mentee_id, title, description, scheduled_at, duration_minutes, meeting_link }) => {
    const { rows } = await db.query(
      `INSERT INTO sessions (mentor_id, mentee_id, title, description, scheduled_at, duration_minutes, meeting_link)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [mentor_id, mentee_id, title, description, scheduled_at, duration_minutes || 60, meeting_link || null]
    );
    return rows[0];
  },

  /** Update session status */
  updateStatus: async (id, status) => {
    const { rows } = await db.query(
      `UPDATE sessions SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *`,
      [status, id]
    );
    return rows[0];
  },

  /** Get sessions for a mentee */
  getByMentee: async (mentee_id) => {
    const { rows } = await db.query(`
      SELECT s.*, u.name AS mentor_name, u.email AS mentor_email
      FROM sessions s
      JOIN users u ON u.id = s.mentor_id
      WHERE s.mentee_id = $1
      ORDER BY s.scheduled_at DESC
    `, [mentee_id]);
    return rows;
  },

  /** Get sessions for a mentor */
  getByMentor: async (mentor_id) => {
    const { rows } = await db.query(`
      SELECT s.*, u.name AS mentee_name, u.email AS mentee_email
      FROM sessions s
      JOIN users u ON u.id = s.mentee_id
      WHERE s.mentor_id = $1
      ORDER BY s.scheduled_at DESC
    `, [mentor_id]);
    return rows;
  },

  /** Get all sessions (admin) */
  getAll: async () => {
    const { rows } = await db.query(`
      SELECT s.*,
             m.name AS mentor_name,
             e.name AS mentee_name
      FROM sessions s
      JOIN users m ON m.id = s.mentor_id
      JOIN users e ON e.id = s.mentee_id
      ORDER BY s.scheduled_at DESC
    `);
    return rows;
  },

  /** Get single session by ID */
  findById: async (id) => {
    const { rows } = await db.query('SELECT * FROM sessions WHERE id = $1', [id]);
    return rows[0];
  },
};

module.exports = Session;