const mongoose = require('mongoose');

const JobStatSchema = new mongoose.Schema({
  job_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', unique: true, required: true },
  views: { type: Number, default: 0 },
  applies: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('JobStat', JobStatSchema);
