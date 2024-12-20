// src/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validationMiddleware = require('../middlewares/validationMiddleware');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: 회원 인증 및 관리 API
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: 회원가입
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ "email", "password", "name" ]
 *             properties:
 *               email:
 *                 type: string
 *                 description: 사용자 이메일
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 description: 사용자 비밀번호 (최소 6자 이상)
 *                 example: "123456"
 *               name:
 *                 type: string
 *                 description: 사용자 이름
 *                 example: "John Doe"
 *     responses:
 *       200:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *       409:
 *         description: 이미 존재하는 이메일
 *       400:
 *         description: 유효성 검사 실패
 */
router.post('/register',
  body('email').isEmail().withMessage('유효한 이메일을 입력해주세요.'),
  body('password').isLength({ min: 6 }).withMessage('비밀번호는 최소 6자 이상이어야 합니다.'),
  body('name').notEmpty().withMessage('이름을 입력해주세요.'),
  validationMiddleware,
  authController.register
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: 로그인
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ "email", "password" ]
 *             properties:
 *               email:
 *                 type: string
 *                 description: 사용자 이메일
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 description: 사용자 비밀번호
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: 로그인 성공 (Access Token, Refresh Token 반환)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       401:
 *         description: 인증 실패 (잘못된 이메일 또는 비밀번호)
 *       400:
 *         description: 유효성 검사 실패
 */
router.post('/login',
  body('email').isEmail().withMessage('유효한 이메일을 입력해주세요.'),
  body('password').notEmpty().withMessage('비밀번호를 입력해주세요.'),
  validationMiddleware,
  authController.login
);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: 토큰 갱신
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ "refreshToken" ]
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: 발급받은 Refresh 토큰
 *                 example: "eyJhbGciOiJI..."
 *     responses:
 *       200:
 *         description: 새로운 Access Token 및 Refresh Token 반환
 *       401:
 *         description: 유효하지 않은 토큰
 *       400:
 *         description: 유효성 검사 실패
 */
router.post('/refresh',
  body('refreshToken').notEmpty().withMessage('Refresh 토큰을 입력해주세요.'),
  validationMiddleware,
  authController.refresh
);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: 회원 정보 조회
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 회원 정보 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *       401:
 *         description: 인증 필요 (토큰 미제공 또는 무효)
 */
router.get('/profile',
  authMiddleware,
  authController.getProfile
);

/**
 * @swagger
 * /auth/profile:
 *   put:
 *     summary: 회원 정보 수정
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 변경할 이름
 *               password:
 *                 type: string
 *                 description: 변경할 비밀번호
 *     responses:
 *       200:
 *         description: 회원 정보 수정 성공
 *       401:
 *         description: 인증 필요 (토큰 미제공 또는 무효)
 *       404:
 *         description: 사용자 없음
 */
router.put('/profile',
  authMiddleware,
  validationMiddleware,
  authController.updateProfile
);

/**
 * @swagger
 * /auth/profile:
 *   delete:
 *     summary: 회원 탈퇴
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 계정 삭제 성공
 *       401:
 *         description: 인증 필요 (토큰 미제공 또는 무효)
 *       404:
 *         description: 사용자 없음
 */
router.delete('/profile',
  authMiddleware,
  authController.deleteProfile
);

module.exports = router;
