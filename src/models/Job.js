// src/models/Job.js
const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  title: { type: String, required: true },
  link: { type: String, required: true, unique: true },
  location: String,
  experience: String,
  education: String,
  employment_type: String,
  deadline: String,
  sector: String,
  views: { type: Number, default: 0 },
  stacks: [{ type: String, index: true }]
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
