/**
 * seed.js — Seeds reference data into MongoDB Atlas from shared JSON files.
 * Run: node seed.js
 * Always wipes & re-inserts to pick up any changes in the shared JSON files.
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
  await MessMenuItem.deleteMany({});
  const menuResult = await MessMenuItem.insertMany(MENU_DATA);
  console.log(`✅ Inserted ${menuResult.length} mess menu items`);

  // ── Schedule Items ────────────────────────────────────────────────────────
  await ScheduleItem.deleteMany({});
  const schedResult = await ScheduleItem.insertMany(SCHEDULE_DATA);
  console.log(`✅ Inserted ${schedResult.length} schedule items`);

  await mongoose.disconnect();
  console.log('🎉 Seeding complete!');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
