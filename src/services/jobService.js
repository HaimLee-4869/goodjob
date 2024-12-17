const Job = require('../models/Job');
const Company = require('../models/Company');
const mongoose = require('mongoose');

async function getJobs({ page, limit, location, experience, stacks, keyword, sort }) {
  const query = {};

  if (location) query.location = location;
  if (experience) query.experience = experience;

  if (stacks) {
    // stacks 파라미터를 콤마로 구분된 문자열이라 가정
    const stackArray = stacks.split(',').map(s => s.trim());
    query.stacks = { $all: stackArray }; // 모든 스택을 포함하는 공고
  }

  if (keyword) {
    query.$or = [
      { title: { $regex: keyword, $options: 'i' } },
      { sector: { $regex: keyword, $options: 'i' } }
      // 회사명 기반 검색도 가능하려면 company_id 참조 후 populate나 aggregation 필요
    ];
  }

  const totalItems = await Job.countDocuments(query);
  const totalPages = Math.ceil(totalItems / limit);

  let mongooseQuery = Job.find(query).populate('company_id');

  if (sort) {
    // 예: sort=-deadline 형태
    mongooseQuery = mongooseQuery.sort(sort);
  }

  const jobs = await mongooseQuery
    .skip((page - 1) * limit)
    .limit(limit);

  const pagination = {
    currentPage: page,
    totalPages,
    totalItems
  };

  return { jobs, pagination };
}

async function getJobDetail(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('유효하지 않은 ID');
    err.statusCode = 400;
    throw err;
  }

  const job = await Job.findById(id).populate('company_id');
  if (!job) {
    const err = new Error('해당 공고를 찾을 수 없습니다.');
    err.statusCode = 404;
    throw err;
  }

  // 조회수 증가
  job.views = (job.views || 0) + 1;
  await job.save();

  return job;
}

async function createJob({ title, company_id, location, experience, stacks }) {
  if (!title || !company_id) {
    const err = new Error('필수 필드 누락');
    err.statusCode = 400;
    throw err;
  }

  // company_id 검증
  if (!mongoose.Types.ObjectId.isValid(company_id)) {
    const err = new Error('유효하지 않은 company_id');
    err.statusCode = 400;
    throw err;
  }

  const companyExists = await Company.findById(company_id);
  if (!companyExists) {
    const err = new Error('회사 정보를 찾을 수 없습니다.');
    err.statusCode = 404;
    throw err;
  }

  const job = await Job.create({ title, company_id, location, experience, stacks });
  return job;
}

async function updateJob(id, { title, location, experience, stacks, deadline }) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('유효하지 않은 ID');
    err.statusCode = 400;
    throw err;
  }

  const job = await Job.findById(id);
  if (!job) {
    const err = new Error('해당 공고를 찾을 수 없습니다.');
    err.statusCode = 404;
    throw err;
  }

  if (title !== undefined) job.title = title;
  if (location !== undefined) job.location = location;
  if (experience !== undefined) job.experience = experience;
  if (stacks !== undefined) job.stacks = stacks;
  if (deadline !== undefined) job.deadline = deadline;

  await job.save();
  return job;
}

async function deleteJob(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('유효하지 않은 ID');
    err.statusCode = 400;
    throw err;
  }

  const result = await Job.findByIdAndDelete(id);
  if (!result) {
    const err = new Error('해당 공고를 찾을 수 없습니다.');
    err.statusCode = 404;
    throw err;
  }
}

module.exports = {
  getJobs,
  getJobDetail,
  createJob,
  updateJob,
  deleteJob
};
