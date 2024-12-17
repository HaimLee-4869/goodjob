const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const authMiddleware = require('../middlewares/authMiddleware');
const { body, query } = require('express-validator');
const validationMiddleware = require('../middlewares/validationMiddleware');

/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: 지원 관리 API
 */

/**
 * @swagger
 * /applications:
 *   post:
 *     summary: 지원하기
 *     tags: [Applications]
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
 *                 description: 지원할 공고의 ID
 *               resume_id:
 *                 type: string
 *                 description: 첨부할 이력서 ID (선택)
 *     responses:
 *       200:
 *         description: 지원 성공
 *       409:
 *         description: 중복 지원 시 에러
 */
router.post('/',
  authMiddleware,
  body('job_id').notEmpty().withMessage('job_id는 필수입니다.'),
  validationMiddleware,
  applicationController.apply
);

/**
 * @swagger
 * /applications:
 *   get:
 *     summary: 지원 내역 조회
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: 필터할 상태 (applied, canceled 등)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: "정렬 기준 (예: -applicationDate)"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: 페이지 당 개수
 *     responses:
 *       200:
 *         description: 성공적으로 조회
 */
router.get('/',
  authMiddleware,
  query('page').optional().isInt({ min:1 }),
  query('limit').optional().isInt({ min:1 }),
  validationMiddleware,
  applicationController.getApplications
);

/**
 * @swagger
 * /applications/{id}:
 *   delete:
 *     summary: 지원 취소
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 취소할 지원 내역의 ID
 *     responses:
 *       200:
 *         description: 취소 성공
 *       404:
 *         description: 해당 지원 내역 없음
 *       400:
 *         description: 이미 취소 불가능한 상태
 */
router.delete('/:id',
  authMiddleware,
  applicationController.cancelApplication
);

module.exports = router;
