const jobService = require('../services/jobService');

exports.getJobs = async (req, res, next) => {
  try {
    const { page=1, limit=20, location, experience, stacks, keyword, sort } = req.query;
    const { jobs, pagination } = await jobService.getJobs({ page: Number(page), limit: Number(limit), location, experience, stacks, keyword, sort });
    res.json({ status: 'success', data: jobs, pagination });
  } catch (error) {
    next(error);
  }
};

exports.getJobDetail = async (req, res, next) => {
  try {
    const job = await jobService.getJobDetail(req.params.id);
    res.json({ status: 'success', data: job });
  } catch (error) {
    next(error);
  }
};

exports.createJob = async (req, res, next) => {
  try {
    const { title, company_id, location, experience, stacks } = req.body;
    const job = await jobService.createJob({ title, company_id, location, experience, stacks });
    res.json({ status: 'success', data: job });
  } catch (error) {
    next(error);
  }
};

exports.updateJob = async (req, res, next) => {
  try {
    const { title, location, experience, stacks, deadline } = req.body;
    const job = await jobService.updateJob(req.params.id, { title, location, experience, stacks, deadline });
    res.json({ status: 'success', data: job });
  } catch (error) {
    next(error);
  }
};

exports.deleteJob = async (req, res, next) => {
  try {
    await jobService.deleteJob(req.params.id);
    res.json({ status: 'success', message: '공고가 삭제되었습니다.' });
  } catch (error) {
    next(error);
  }
};
