// ============================================================
// User Model — DB queries for users table
// ============================================================
const db = require('../config/db');

const User = {
  /** Find user by email */
  findByEmail: async (email) => {
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0];
  },

  /** Find user by ID */
  findById: async (id) => {
    const { rows } = await db.query(
      'SELECT id, name, email, role, bio, profile_picture, created_at FROM users WHERE id = $1',
      [id]
    );
    return rows[0];
  },

  /** Create a new user */
  create: async ({ name, email, password_hash, role, bio }) => {
    const { rows } = await db.query(
      `INSERT INTO users (name, email, password_hash, role, bio)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role`,
      [name, email, password_hash, role, bio || null]
    );
    return rows[0];
  },

  /** Update user profile */
  update: async (id, { name, bio }) => {
    const { rows } = await db.query(
      `UPDATE users SET name=$1, bio=$2, updated_at=NOW()
       WHERE id=$3 RETURNING id, name, email, role, bio`,
      [name, bio, id]
    );
    return rows[0];
  },

  /** Get all users (admin) */
  getAll: async () => {
    const { rows } = await db.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    return rows;
  },
};

module.exports = User;