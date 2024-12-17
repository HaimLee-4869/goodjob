const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const { body, query } = require('express-validator');
const validationMiddleware = require('../middlewares/validationMiddleware');

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: 채용 공고 관련 API
 */

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: 채용 공고 목록 조회
 *     tags: [Jobs]
 *     parameters:
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
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: 지역 필터
 *       - in: query
 *         name: experience
 *         schema:
 *           type: string
 *         description: 경력 필터
 *       - in: query
 *         name: stacks
 *         schema:
 *           type: string
 *         description: "기술스택 필터 (콤마로 구분 ex: node,react)"
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 키워드 검색
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: "정렬 기준 (ex: -deadline)"
 *     responses:
 *       200:
 *         description: 성공
 */
router.get('/',
  query('page').optional().isInt({ min:1 }).withMessage('page는 1 이상의 정수여야 합니다.'),
  query('limit').optional().isInt({ min:1 }).withMessage('limit는 1 이상의 정수여야 합니다.'),
  validationMiddleware,
  jobController.getJobs
);

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: 채용 공고 상세 조회
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 공고 ID
 *     responses:
 *       200:
 *         description: 성공
 *       404:
 *         description: 공고를 찾을 수 없음
 */
router.get('/:id', jobController.getJobDetail);

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: 채용 공고 등록 (관리자 전용)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ "title", "company_id" ]
 *             properties:
 *               title:
 *                 type: string
 *               company_id:
 *                 type: string
 *               location:
 *                 type: string
 *               experience:
 *                 type: string
 *               stacks:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: 성공
 *       400:
 *         description: 필수 필드 누락
 *       403:
 *         description: 관리자 권한 없음
 */
router.post('/',
  authMiddleware,
  adminMiddleware,
  body('title').notEmpty().withMessage('title은 필수입니다.'),
  body('company_id').notEmpty().withMessage('company_id는 필수입니다.'),
  validationMiddleware,
  jobController.createJob
);

router.put('/:id',
  authMiddleware,
  adminMiddleware,
  jobController.updateJob
);

router.delete('/:id',
  authMiddleware,
  adminMiddleware,
  jobController.deleteJob
);

module.exports = router;
