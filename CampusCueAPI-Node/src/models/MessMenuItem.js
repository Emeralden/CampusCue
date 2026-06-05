const mongoose = require('mongoose');

const MessMenuItemSchema = new mongoose.Schema({
  cycle_type: { type: String, required: true },
  menu_type:  { type: String, required: true },
  day_of_week:{ type: String, required: true },
  meal_type:  { type: String, required: true },
  description:{ type: String, required: true },
});

// Mirror the unique constraint from SQL
MessMenuItemSchema.index(
  { cycle_type: 1, day_of_week: 1, meal_type: 1, menu_type: 1 },
  { unique: true }
);

module.exports = mongoose.model('MessMenuItem', MessMenuItemSchema);
