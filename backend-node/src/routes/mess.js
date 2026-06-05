const express = require('express');
const router = express.Router();
const MessMenuItem = require('../models/MessMenuItem');
const { authenticate } = require('../middleware/auth');

const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

// ─── GET /mess/my-menu?date=YYYY-MM-DD ────────────────────────────────────────

router.get('/my-menu', authenticate, async (req, res) => {
  const { date } = req.query;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ detail: 'date query param required (YYYY-MM-DD)' });
  }

  const day_of_week = DAY_NAMES[new Date(date).getDay()];
  const { mess_cycle, diet_type } = req.user;

  const items = await MessMenuItem.find({
    cycle_type: mess_cycle,
    day_of_week,
    menu_type: diet_type,
  });

  const meals = {};
  for (const item of items) {
    meals[item.meal_type] = item.description;
  }

  return res.json({ date, day_of_week, cycle: mess_cycle, meals });
});

// ─── GET /mess?cycle=... ──────────────────────────────────────────────────────

router.get('/', authenticate, async (req, res) => {
  const { cycle } = req.query;
  if (!cycle) {
    return res.status(400).json({ detail: 'cycle query param required' });
  }

  const items = await MessMenuItem.find({ cycle_type: cycle, menu_type: req.user.diet_type });
  return res.json(items);
});

module.exports = router;
