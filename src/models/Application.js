const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  applicationDate: { type: Date, default: Date.now },
  status: { type: String, default: 'applied' } // applied, canceled, hired, rejected 등
}, { timestamps: true });

module.exports = mongoose.model('Application', ApplicationSchema);
