const Application = require('../models/Application');
const Job = require('../models/Job');
const mongoose = require('mongoose');

async function apply(userId, jobId, resumeId) {
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    const err = new Error('유효하지 않은 job_id');
    err.statusCode = 400;
    throw err;
  }

  // Job 존재 여부 확인
  const job = await Job.findById(jobId);
  if (!job) {
    const err = new Error('해당 공고를 찾을 수 없습니다.');
    err.statusCode = 404;
    throw err;
  }

  // Application 생성 시, user_id, job_id unique index 존재 -> 중복지원 시 에러 발생
  try {
    const newApp = await Application.create({
      user_id: userId,
      job_id: jobId,
      status: 'applied',
      resume_id: resumeId ? resumeId : undefined
    });
    return newApp;
  } catch (error) {
    if (error.code === 11000) {
      // 중복 키 에러 (이미 같은 user_id, job_id로 존재)
      const err = new Error('이미 해당 공고에 지원하셨습니다.');
      err.statusCode = 409;
      throw err;
    }
    throw error;
  }
}

async function getApplications(userId, { status, sort, page, limit }) {
  const query = { user_id: userId };
  if (status) {
    query.status = status;
  }

  let mongooseQuery = Application.find(query).populate('job_id');

  if (sort) {
    mongooseQuery = mongooseQuery.sort(sort);
  }

  const totalItems = await Application.countDocuments(query);
  const totalPages = Math.ceil(totalItems / limit);

  const apps = await mongooseQuery
    .skip((page - 1) * limit)
    .limit(limit);

  const pagination = {
    currentPage: page,
    totalPages,
    totalItems
  };

  return { applications: apps, pagination };
}

async function cancelApplication(userId, appId) {
  if (!mongoose.Types.ObjectId.isValid(appId)) {
    const err = new Error('유효하지 않은 application ID');
    err.statusCode = 400;
    throw err;
  }

  const app = await Application.findOne({ _id: appId, user_id: userId });
  if (!app) {
    const err = new Error('해당 지원 내역을 찾을 수 없습니다.');
    err.statusCode = 404;
    throw err;
  }

  // 상태 체크: 이미 hired나 rejected 상태라면 취소 불가라고 가정
  // 여기서는 "applied" 상태에서만 "canceled"로 변경 가능
  if (app.status !== 'applied') {
    const err = new Error('현재 상태에서 취소할 수 없습니다.');
    err.statusCode = 400;
    throw err;
  }

  // 상태를 canceled로 업데이트
  app.status = 'canceled';
  await app.save();
}

module.exports = {
  apply,
  getApplications,
  cancelApplication
};
