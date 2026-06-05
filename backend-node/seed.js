/**
 * seed.js — Seeds reference data into MongoDB Atlas from shared JSON files.
 * Run: node seed.js
 * Safe to re-run — skips if data already exists.
 */

require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');
const MessMenuItem = require('./src/models/MessMenuItem');
const ScheduleItem = require('./src/models/ScheduleItem');

const SHARED_DIR = path.join(__dirname, '..', 'shared');
const MENU_DATA = require(path.join(SHARED_DIR, 'menu_data.json'));
const SCHEDULE_DATA = require(path.join(SHARED_DIR, 'schedule_data.json'));

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  // ── Mess Menu ─────────────────────────────────────────────────────────────
  const menuCount = await MessMenuItem.countDocuments();
  if (menuCount === 0) {
    const result = await MessMenuItem.insertMany(MENU_DATA);
    console.log(`✅ Inserted ${result.length} mess menu items`);
  } else {
    console.log(`⏭️  Mess menu already seeded (${menuCount} items) — skipping`);
  }

  // ── Schedule Items ────────────────────────────────────────────────────────
  const schedCount = await ScheduleItem.countDocuments();
  if (schedCount === 0) {
    const result = await ScheduleItem.insertMany(SCHEDULE_DATA);
    console.log(`✅ Inserted ${result.length} schedule items`);
  } else {
    console.log(`⏭️  Schedule already seeded (${schedCount} items) — skipping`);
  }

  await mongoose.disconnect();
  console.log('🎉 Seeding complete!');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
