// ============================================================
// Express App Configuration
// ============================================================
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');

const authRoutes     = require('./routes/authRoutes');
const userRoutes     = require('./routes/userRoutes');
const sessionRoutes  = require('./routes/sessionRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

// Routes
app.use('/api/auth',     authRoutes);
app.use('/api/users',    userRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/feedback', feedbackRoutes);

// Health check
app.get('/health', (_, res) => res.json({ status: 'ok', project: 'AUCA Mentorship Portal' }));

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;