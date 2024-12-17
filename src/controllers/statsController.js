// src/controllers/statsController.js
const statsService = require('../services/statsService');

exports.getCompanyJobs = async (req, res, next) => {
  try {
    const data = await statsService.getCompanyJobs();
    res.json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

exports.getJobSectorDistribution = async (req, res, next) => {
  try {
    const data = await statsService.getJobSectorDistribution();
    res.json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

exports.getRecentApplications = async (req, res, next) => {
  try {
    const { days = 7 } = req.query;
    const result = await statsService.getRecentApplications(Number(days));
    res.json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};
