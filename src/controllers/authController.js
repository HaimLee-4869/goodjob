const authService = require('../services/authService');

exports.register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const user = await authService.registerUser(email, password, name);
    res.json({ status: 'success', data: { _id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.loginUser(email, password);
    res.json({
      status: 'success',
      data: {
        user: { _id: user._id, email: user.email, name: user.name },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshTokens(refreshToken);
    res.json({ status: 'success', data: tokens });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await authService.getUserProfile(req.user._id);
    res.json({ status: 'success', data: user });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, password } = req.body;
    const user = await authService.updateUserProfile(req.user._id, { name, password });
    res.json({ status: 'success', data: user });
  } catch (error) {
    next(error);
  }
};

exports.deleteProfile = async (req, res, next) => {
  try {
    await authService.deleteUser(req.user._id);
    res.json({ status: 'success', message: '계정이 삭제되었습니다.' });
  } catch (error) {
    next(error);
  }
};
