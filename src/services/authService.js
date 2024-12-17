const User = require('../models/User');
const { generateAccessToken, generateRefreshToken, verifyToken } = require('../utils/jwt');
const { Buffer } = require('buffer');

async function registerUser(email, password, name) {
  // 중복 체크
  const exists = await User.findOne({ email });
  if (exists) {
    const err = new Error('이미 존재하는 이메일');
    err.statusCode = 409;
    err.code = 'DUPLICATE_EMAIL';
    throw err;
  }
  const encodedPassword = Buffer.from(password).toString('base64');
  const user = await User.create({ email, password: encodedPassword, name });
  return user;
}

async function loginUser(email, password) {
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error('이메일 또는 비밀번호가 잘못되었습니다.');
    err.statusCode = 401;
    err.code = 'AUTH_FAIL';
    throw err;
  }
  // 비밀번호 비교
  const encodedPassword = Buffer.from(password).toString('base64');
  if (user.password !== encodedPassword) {
    const err = new Error('이메일 또는 비밀번호가 잘못되었습니다.');
    err.statusCode = 401;
    err.code = 'AUTH_FAIL';
    throw err;
  }

  // 로그인 성공: 토큰 발급
  const payload = { _id: user._id, email: user.email, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // 로그인 시간 업데이트
  user.lastLoginAt = new Date();
  await user.save();

  return { user, accessToken, refreshToken };
}

async function refreshTokens(refreshToken) {
  const decoded = verifyToken(refreshToken);
  if (!decoded) {
    const err = new Error('유효하지 않은 Refresh 토큰');
    err.statusCode = 401;
    err.code = 'INVALID_REFRESH_TOKEN';
    throw err;
  }
  const { _id, email, role } = decoded;
  const payload = { _id, email, role };
  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);
  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

async function getUserProfile(userId) {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    const err = new Error('사용자를 찾을 수 없습니다.');
    err.statusCode = 404;
    err.code = 'USER_NOT_FOUND';
    throw err;
  }
  return user;
}

async function updateUserProfile(userId, { name, password }) {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('사용자를 찾을 수 없습니다.');
    err.statusCode = 404;
    err.code = 'USER_NOT_FOUND';
    throw err;
  }
  if (name) user.name = name;
  if (password) {
    user.password = Buffer.from(password).toString('base64');
  }
  await user.save();
  return user;
}

async function deleteUser(userId) {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    const err = new Error('사용자를 찾을 수 없습니다.');
    err.statusCode = 404;
    err.code = 'USER_NOT_FOUND';
    throw err;
  }
  return user;
}

module.exports = {
  registerUser,
  loginUser,
  refreshTokens,
  getUserProfile,
  updateUserProfile,
  deleteUser
};
