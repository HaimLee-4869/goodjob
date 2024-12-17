// src/models/Job.js
const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  회사명: { type: String, required: true },
  제목: { type: String, required: true },
  링크: { type: String, required: true, unique: true }, // 링크를 unique로 지정하면 중복 삽입 방지에 좋음
  지역: String,
  경력: String,
  학력: String,
  고용형태: String,
  마감일: String,
  직무분야: String
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
