const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: String,
}, { timestamps: true });

module.exports = mongoose.model('Resume', ResumeSchema);
