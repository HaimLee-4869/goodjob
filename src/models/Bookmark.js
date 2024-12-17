const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: false });

BookmarkSchema.index({ user_id: 1, job_id: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', BookmarkSchema);
