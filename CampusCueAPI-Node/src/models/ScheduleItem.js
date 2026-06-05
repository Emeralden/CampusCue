const mongoose = require('mongoose');

const ScheduleItemSchema = new mongoose.Schema({
  day_of_week: { type: String, required: true },
  item_type:   { type: String, required: true },   // 'class' | 'lab'
  course_type: { type: String, default: 'core' },  // 'core' | 'elective' | 'la'
  name:        { type: String, required: true },
  room:        { type: String, required: true },
  start_time:  { type: String, required: true },   // "HH:MM:SS"
  end_time:    { type: String, required: true },
});

module.exports = mongoose.model('ScheduleItem', ScheduleItemSchema);
