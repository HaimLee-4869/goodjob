const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, index: true },
  password: { type: String, required: true }, // 실제 과제 시 Base64나 hashing 필요
  name: { type: String, required: true },
  role: { type: String, default: 'user' }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
