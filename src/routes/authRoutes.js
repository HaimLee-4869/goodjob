const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validationMiddleware = require('../middlewares/validationMiddleware');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// 회원가입
router.post('/register',
  body('email').isEmail().withMessage('유효한 이메일을 입력해주세요.'),
  body('password').isLength({ min: 6 }).withMessage('비밀번호는 최소 6자 이상이어야 합니다.'),
  body('name').notEmpty().withMessage('이름을 입력해주세요.'),
  validationMiddleware,
  authController.register
);

// 로그인
router.post('/login',
  body('email').isEmail().withMessage('유효한 이메일을 입력해주세요.'),
  body('password').notEmpty().withMessage('비밀번호를 입력해주세요.'),
  validationMiddleware,
  authController.login
);

// 토큰 갱신
router.post('/refresh',
  body('refreshToken').notEmpty().withMessage('Refresh 토큰을 입력해주세요.'),
  validationMiddleware,
  authController.refresh
);

// 회원 정보 조회
router.get('/profile',
  authMiddleware,
  authController.getProfile
);

// 회원 정보 수정
router.put('/profile',
  authMiddleware,
  // name, password는 선택사항이므로 validator 강제 X
  validationMiddleware,
  authController.updateProfile
);

// 회원 탈퇴
router.delete('/profile',
  authMiddleware,
  authController.deleteProfile
);

module.exports = router;
