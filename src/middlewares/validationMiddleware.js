const { validationResult } = require('express-validator');

function validationMiddleware(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      status: 'error', 
      message: '유효성 검사 실패', 
      code: 'VALIDATION_ERROR', 
      errors: errors.array() 
    });
  }
  next();
}

module.exports = validationMiddleware;
