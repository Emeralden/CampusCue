const mongoose = require('mongoose');

const ScheduleOverrideSchema = new mongoose.Schema({
  user_id:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  override_date: { type: String, required: true },  // "YYYY-MM-DD"
  target_day:    { type: String, required: true },  // "monday" | "tuesday" etc.
});

ScheduleOverrideSchema.index({ user_id: 1, override_date: 1 }, { unique: true });

ScheduleOverrideSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('ScheduleOverride', ScheduleOverrideSchema);
