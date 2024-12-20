const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmarkController');
const authMiddleware = require('../middlewares/authMiddleware');
const { body, query } = require('express-validator');
const validationMiddleware = require('../middlewares/validationMiddleware');

/**
 * @swagger
 * tags:
 *   name: Bookmarks
 *   description: 북마크 관리 API
 */

/**
 * @swagger
 * /bookmarks:
 *   post:
 *     summary: 북마크 토글 (추가/제거)
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ "job_id" ]
 *             properties:
 *               job_id:
 *                 type: string
 *                 description: 북마크할 공고의 ID
 *     responses:
 *       200:
 *         description: 북마크 상태 변경 성공
 *       400:
 *         description: 유효하지 않은 job_id
 *       404:
 *         description: 공고를 찾을 수 없음
 */
router.post('/',
  authMiddleware,
  body('job_id').notEmpty().withMessage('job_id는 필수입니다.'),
  validationMiddleware,
  bookmarkController.toggleBookmark
);

/**
 * @swagger
 * /bookmarks:
 *   get:
 *     summary: 북마크 목록 조회
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: "페이지 번호 (기본값: 1)"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: "페이지 당 개수 (기본값: 20)"
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: "정렬 기준 (예: -createdAt로 최신순)"
 *     responses:
 *       200:
 *         description: 북마크 목록 조회 성공
 */
router.get('/',
  authMiddleware,
  query('page').optional().isInt({ min:1 }).withMessage('page는 1 이상의 정수'),
  query('limit').optional().isInt({ min:1 }).withMessage('limit는 1 이상의 정수'),
  validationMiddleware,
  bookmarkController.getBookmarks
);

module.exports = router;
