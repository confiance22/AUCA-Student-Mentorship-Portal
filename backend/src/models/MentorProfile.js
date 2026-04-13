// ============================================================
// MentorProfile Model
// ============================================================
const db = require('../config/db');

const MentorProfile = {
  /** Create mentor profile when user registers as mentor */
  create: async ({ user_id, expertise, department, year_of_study, availability }) => {
    const { rows } = await db.query(
      `INSERT INTO mentor_profiles (user_id, expertise, department, year_of_study, availability)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user_id, expertise, department, year_of_study, availability]
    );
    return rows[0];
  },

  /** Get all approved mentors with user details */
  getApproved: async () => {
    const { rows } = await db.query(`
      SELECT u.id, u.name, u.email, u.bio, u.profile_picture,
             mp.expertise, mp.department, mp.year_of_study, mp.availability,
             COALESCE(AVG(f.rating), 0)::NUMERIC(3,1) AS avg_rating,
             COUNT(f.id) AS review_count
      FROM users u
      JOIN mentor_profiles mp ON mp.user_id = u.id
      LEFT JOIN feedback f ON f.mentor_id = u.id
      WHERE mp.approval_status = 'approved'
      GROUP BY u.id, mp.id
      ORDER BY avg_rating DESC
    `);
    return rows;
  },

  /** Get pending mentor applications (admin) */
  getPending: async () => {
    const { rows } = await db.query(`
      SELECT u.id, u.name, u.email, mp.*
      FROM users u
      JOIN mentor_profiles mp ON mp.user_id = u.id
      WHERE mp.approval_status = 'pending'
      ORDER BY mp.created_at ASC
    `);
    return rows;
  },

  /** Approve or reject a mentor */
  updateStatus: async (user_id, status, approved_by) => {
    const { rows } = await db.query(
      `UPDATE mentor_profiles
       SET approval_status=$1, approved_by=$2, approved_at=NOW()
       WHERE user_id=$3 RETURNING *`,
      [status, approved_by, user_id]
    );
    return rows[0];
  },

  /** Get mentor profile by user_id */
  findByUserId: async (user_id) => {
    const { rows } = await db.query(
      'SELECT * FROM mentor_profiles WHERE user_id = $1',
      [user_id]
    );
    return rows[0];
  },
};

module.exports = MentorProfile;