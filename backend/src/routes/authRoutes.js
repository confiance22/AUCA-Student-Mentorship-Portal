const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { authenticate } = require('../middlewares/authMiddleware');
const bcrypt = require('bcrypt'); // Added for the fix
const pool = require('../config/db'); // Ensure this points to your DB config

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);

// --- TEMPORARY FIX ROUTE ---
router.get('/fix-passwords', async (req, res) => {
  try {
    const adminHash = await bcrypt.hash('password123', 10);
    const userHash = await bcrypt.hash('password', 10);
    
    await pool.query('UPDATE users SET password_hash = $1 WHERE email = $2', [adminHash, 'admin@auca.ac.rw']);
    await pool.query('UPDATE users SET password_hash = $1 WHERE role != $2', [userHash, 'admin']);
    
    res.send("All passwords re-hashed by the server successfully!");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
