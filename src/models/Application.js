const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  status: { type: String, default: 'applied', index: true }, // applied, canceled, hired, rejected 등
  applicationDate: { type: Date, default: Date.now },
  // 이력서 첨부 가능: resume_id 등 필드 추가 가능
  resume_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' } // 선택사항
}, { timestamps: true });

ApplicationSchema.index({ user_id: 1, job_id: 1 }, { unique: true }); // 유저별 같은 공고 중복 지원 방지

module.exports = mongoose.model('Application', ApplicationSchema);
