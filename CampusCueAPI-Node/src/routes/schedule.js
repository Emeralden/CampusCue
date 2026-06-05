const express = require('express');
const router = express.Router();
const ScheduleItem = require('../models/ScheduleItem');
const ScheduleOverride = require('../models/ScheduleOverride');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

async function getActiveOverride(userId, dateStr) {
  return ScheduleOverride.findOne({ user_id: userId, override_date: dateStr });
}

async function buildScheduleForDay(user, dayOfWeek) {
  // Core classes for that day
  const coreItems = await ScheduleItem.find({ day_of_week: dayOfWeek, course_type: 'core' });

  // User's subscribed items for that day
  const subscribedItems = await ScheduleItem.find({
    _id: { $in: user.subscribed_schedules },
    day_of_week: dayOfWeek,
  });

  const combined = [...coreItems, ...subscribedItems];
  combined.sort((a, b) => timeToMinutes(a.start_time) - timeToMinutes(b.start_time));
  return combined;
}

// ─── GET /schedule/subscriptions ─────────────────────────────────────────────

router.get('/subscriptions', authenticate, (req, res) => {
  return res.json(req.user.subscribed_schedules);
});

// ─── POST /schedule/subscriptions ────────────────────────────────────────────

router.post('/subscriptions', authenticate, async (req, res) => {
  const { schedule_item_ids } = req.body;

  if (!Array.isArray(schedule_item_ids)) {
    return res.status(422).json({ detail: 'schedule_item_ids must be an array' });
  }

  if (schedule_item_ids.length === 0) {
    req.user.subscribed_schedules = [];
    await req.user.save();
    return res.status(204).send();
  }

  const selected = await ScheduleItem.find({ _id: { $in: schedule_item_ids } });

  // Clash detection
  const sorted = [...selected].sort((a, b) => {
    if (a.day_of_week !== b.day_of_week) return a.day_of_week.localeCompare(b.day_of_week);
    return timeToMinutes(a.start_time) - timeToMinutes(b.start_time);
  });

  for (let i = 0; i < sorted.length - 1; i++) {
    const curr = sorted[i];
    const next = sorted[i + 1];
    if (
      curr.day_of_week === next.day_of_week &&
      timeToMinutes(next.start_time) < timeToMinutes(curr.end_time)
    ) {
      return res.status(400).json({
        detail: `Schedule clash detected between ${curr.name} and ${next.name}.`,
      });
    }
  }

  req.user.subscribed_schedules = schedule_item_ids;
  await req.user.save();
  return res.status(204).send();
});

// ─── GET /schedule/electives ──────────────────────────────────────────────────

router.get('/electives', async (_req, res) => {
  const items = await ScheduleItem.find({ course_type: { $in: ['elective', 'la'] } });
  return res.json(items);
});

// ─── POST /schedule/overrides ─────────────────────────────────────────────────

router.post('/overrides', authenticate, async (req, res) => {
  const { override_date, target_day } = req.body;
  if (!override_date || !target_day) {
    return res.status(422).json({ detail: 'override_date and target_day are required' });
  }

  const override = await ScheduleOverride.findOneAndUpdate(
    { user_id: req.user._id, override_date },
    { target_day },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return res.status(201).json(override);
});

// ─── GET /schedule/overrides/:date ───────────────────────────────────────────

router.get('/overrides/:date_str', authenticate, async (req, res) => {
  const override = await getActiveOverride(req.user._id, req.params.date_str);
  return res.json(override || null);
});

// ─── DELETE /schedule/overrides/:date ────────────────────────────────────────

router.delete('/overrides/:date_str', authenticate, async (req, res) => {
  await ScheduleOverride.deleteOne({ user_id: req.user._id, override_date: req.params.date_str });
  return res.status(204).send();
});

// ─── GET /schedule/my-day?date=... ───────────────────────────────────────────

router.get('/my-day', authenticate, async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ detail: 'date is required' });

  const override = await getActiveOverride(req.user._id, date);
  const dayOfWeek = override ? override.target_day : DAY_NAMES[new Date(date).getDay()];

  const schedule = await buildScheduleForDay(req.user, dayOfWeek);
  return res.json(schedule);
});

// ─── GET /schedule/my-day-details?date=... ───────────────────────────────────

router.get('/my-day-details', authenticate, async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ detail: 'date is required' });

  const override = await getActiveOverride(req.user._id, date);
  const dayOfWeek = override ? override.target_day : DAY_NAMES[new Date(date).getDay()];

  const items = await buildScheduleForDay(req.user, dayOfWeek);

  return res.json({
    schedule_day: dayOfWeek,
    has_override: !!override,
    items,
  });
});

// ─── GET /schedule?day=... ────────────────────────────────────────────────────

router.get('/', async (req, res) => {
  const { day } = req.query;
  if (!day) return res.status(400).json({ detail: 'day is required' });

  const items = await ScheduleItem.find({ day_of_week: day }).sort({ start_time: 1 });
  return res.json(items);
});

module.exports = router;
