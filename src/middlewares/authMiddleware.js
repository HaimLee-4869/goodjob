const { verifyToken } = require('../utils/jwt');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'error', message: '토큰이 없습니다', code: 'NO_TOKEN' });
  }
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ status: 'error', message: '유효하지 않은 토큰', code: 'INVALID_TOKEN' });
  }
  req.user = decoded; // { _id, email, role, iat, exp }
  next();
}

module.exports = authMiddleware;
