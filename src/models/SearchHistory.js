const mongoose = require('mongoose');

const SearchHistorySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  keyword: { type: String, required: true },
  searchedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SearchHistory', SearchHistorySchema);
