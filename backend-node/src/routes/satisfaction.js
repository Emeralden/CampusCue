const express = require('express');
const router = express.Router();
const SatisfactionLog = require('../models/SatisfactionLog');
const { authenticate } = require('../middleware/auth');

// ─── POST /satisfaction ───────────────────────────────────────────────────────

router.post('/', authenticate, async (req, res) => {
  const { log_date, satisfaction_level } = req.body;

  if (!log_date || !satisfaction_level) {
    return res.status(422).json({ detail: 'log_date and satisfaction_level are required' });
  }

  const log = await SatisfactionLog.findOneAndUpdate(
    { user_id: req.user._id, log_date },
    { satisfaction_level },
    { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
  );

  return res.status(201).json(log);
});

// ─── GET /satisfaction/history ────────────────────────────────────────────────

router.get('/history', authenticate, async (req, res) => {
  const logs = await SatisfactionLog.find({ user_id: req.user._id }).sort({ log_date: -1 });
  return res.json(logs);
});

module.exports = router;
