function errorHandler(err, req, res, next) {
    console.error(err);
    res.status(err.statusCode || 500).json({
      status: 'error',
      message: err.message || '서버 에러',
      code: err.code || 'SERVER_ERROR'
    });
  }
  
  module.exports = errorHandler;
  