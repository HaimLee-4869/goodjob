const bookmarkService = require('../services/bookmarkService');

exports.toggleBookmark = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { job_id } = req.body;
    const result = await bookmarkService.toggleBookmark(userId, job_id);
    // result가 { action: 'added', bookmark: {...} } 또는 { action: 'removed' } 형태라고 가정
    if (result.action === 'added') {
      res.json({ status: 'success', message: '북마크 추가 성공', data: result.bookmark });
    } else {
      res.json({ status: 'success', message: '북마크 제거 성공' });
    }
  } catch (error) {
    next(error);
  }
};

exports.getBookmarks = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { page=1, limit=20, sort } = req.query;
    const { bookmarks, pagination } = await bookmarkService.getBookmarks(userId, { page: Number(page), limit: Number(limit), sort });
    res.json({ status: 'success', data: bookmarks, pagination });
  } catch (error) {
    next(error);
  }
};
