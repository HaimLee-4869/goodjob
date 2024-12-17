const applicationService = require('../services/applicationService');

exports.apply = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { job_id, resume_id } = req.body;
    const app = await applicationService.apply(userId, job_id, resume_id);
    res.json({ status: 'success', data: app });
  } catch (error) {
    next(error);
  }
};

exports.getApplications = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { status, sort, page=1, limit=20 } = req.query;
    const result = await applicationService.getApplications(userId, { status, sort, page:Number(page), limit:Number(limit) });
    res.json({ status: 'success', data: result.applications, pagination: result.pagination });
  } catch (error) {
    next(error);
  }
};

exports.cancelApplication = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const appId = req.params.id;
    await applicationService.cancelApplication(userId, appId);
    res.json({ status: 'success', message: '지원이 취소되었습니다.' });
  } catch (error) {
    next(error);
  }
};
