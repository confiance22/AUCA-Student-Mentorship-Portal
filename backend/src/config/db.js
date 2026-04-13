// ============================================================
// PostgreSQL Database Connection (Singleton Pool)
// ============================================================
const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME     || 'auca_mentorship_db',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || 'C123',
});

pool.on('connect', () => console.log('PostgreSQL connected'));
pool.on('error',   (err) => console.error('DB error:', err));

module.exports = pool;