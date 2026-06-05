require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Connect to MongoDB
require('./config/db');

const userRouter = require('./routes/user');
const messRouter = require('./routes/mess');
const scheduleRouter = require('./routes/schedule');
const satisfactionRouter = require('./routes/satisfaction');

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // form-urlencoded login support

// ─── Routes ───────────────────────────────────────────────────────────────────

app.get('/', (_req, res) => {
  res.json({ Hello: 'Welcome to CampusCue!' });
});

app.use('/users', userRouter);
app.use('/mess', messRouter);
app.use('/schedule', scheduleRouter);
app.use('/satisfaction', satisfactionRouter);

// ─── Global Error Handler ─────────────────────────────────────────────────────

app.use((err, _req, res, _next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({ detail: err.message || 'Internal server error' });
});

module.exports = app;
