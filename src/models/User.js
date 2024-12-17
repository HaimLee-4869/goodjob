const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, index: true },
  password: { type: String, required: true }, // Base64 인코딩된 비밀번호
  name: { type: String, required: true },
  role: { type: String, default: 'user' },
  lastLoginAt: { type: Date } // 로그인 시간
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
