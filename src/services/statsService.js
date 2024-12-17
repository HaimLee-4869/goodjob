// src/services/statsService.js
const Job = require('../models/Job');
const Company = require('../models/Company');
const Application = require('../models/Application');
const mongoose = require('mongoose');

async function getCompanyJobs() {
  // 회사별 공고 수 집계
  // Job 컬렉션에서 company_id별로 count
  const pipeline = [
    {
      $group: {
        _id: "$company_id",
        count: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: "companies",
        localField: "_id",
        foreignField: "_id",
        as: "company"
      }
    },
    {
      $unwind: "$company"
    },
    {
      $project: {
        _id: 0,
        companyName: "$company.name",
        count: 1
      }
    }
  ];
  const result = await Job.aggregate(pipeline);

  // 결과를 { "회사명": count, ... } 형태의 객체로 변환
  const output = {};
  result.forEach(r => {
    output[r.companyName] = r.count;
  });

  return output;
}

async function getJobSectorDistribution() {
  // 직무 분야(sector)별 공고 수 집계
  const pipeline = [
    {
      $group: {
        _id: "$sector",
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        sector: "$_id",
        count: 1
      }
    }
  ];
  const result = await Job.aggregate(pipeline);

  const output = {};
  result.forEach(r => {
    output[r.sector || "미정"] = r.count; // sector 없을 경우 "미정"
  });
  return output;
}

async function getRecentApplications(days = 7) {
  // 최근 X일 동안의 지원 수
  const since = new Date();
  since.setDate(since.getDate() - days); // days일 전

  const query = {
    applicationDate: { $gte: since }
  };
  const count = await Application.countDocuments(query);
  return { days, applicationCount: count };
}

module.exports = {
  getCompanyJobs,
  getJobSectorDistribution,
  getRecentApplications
};
