const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  full_name: { type: String, required: true },
  hashed_password: { type: String, required: true },
  hashed_refresh_token: { type: String, default: null },
  mess_cycle: { type: String, default: 'weeks_2_4' },
  diet_type: { type: String, default: 'veg' },
  enable_satisfaction_prompt: { type: Boolean, default: false },
  // Embedded array of refs to ScheduleItems the user subscribed to
  subscribed_schedules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ScheduleItem' }],
});

module.exports = mongoose.model('User', UserSchema);
