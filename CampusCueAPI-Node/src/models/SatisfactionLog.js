const mongoose = require('mongoose');

const VALID_LEVELS = ['😄', '🙂', '😐', '🙁', '😞'];

const SatisfactionLogSchema = new mongoose.Schema({
  user_id:            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  log_date:           { type: String, required: true },  // "YYYY-MM-DD"
  satisfaction_level: { type: String, enum: VALID_LEVELS, required: true },
});

SatisfactionLogSchema.index({ user_id: 1, log_date: 1 }, { unique: true });

module.exports = mongoose.model('SatisfactionLog', SatisfactionLogSchema);
