const Bookmark = require('../models/Bookmark');
const Job = require('../models/Job');
const mongoose = require('mongoose');

async function toggleBookmark(userId, jobId) {
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    const err = new Error('유효하지 않은 job_id');
    err.statusCode = 400;
    throw err;
  }

  // 공고 존재 여부 확인
  const job = await Job.findById(jobId);
  if (!job) {
    const err = new Error('해당 공고를 찾을 수 없습니다.');
    err.statusCode = 404;
    throw err;
  }

  // 기존 북마크 존재 여부 확인
  const existing = await Bookmark.findOne({ user_id: userId, job_id: jobId });
  if (existing) {
    // 이미 북마크되어 있으면 제거
    await Bookmark.deleteOne({ _id: existing._id });
    return { action: 'removed' };
  } else {
    // 북마크 추가
    const newBookmark = await Bookmark.create({ user_id: userId, job_id: jobId });
    return { action: 'added', bookmark: newBookmark };
  }
}

async function getBookmarks(userId, { page, limit, sort }) {
  const query = { user_id: userId };
  let mongooseQuery = Bookmark.find(query).populate('job_id'); 
  // populate로 job_id를 통한 공고 정보도 함께 표시 가능

  if (sort) {
    mongooseQuery = mongooseQuery.sort(sort);
  }

  const totalItems = await Bookmark.countDocuments(query);
  const totalPages = Math.ceil(totalItems / limit);

  const bookmarks = await mongooseQuery
    .skip((page - 1) * limit)
    .limit(limit);

  const pagination = {
    currentPage: page,
    totalPages,
    totalItems
  };

  return { bookmarks, pagination };
}

module.exports = {
  toggleBookmark,
  getBookmarks
};
