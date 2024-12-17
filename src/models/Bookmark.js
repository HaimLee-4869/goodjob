const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  createdAt: { type: Date, default: Date.now }
});

// 유저별 같은 job_id 중복 방지
BookmarkSchema.index({ user_id: 1, job_id: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', BookmarkSchema);
