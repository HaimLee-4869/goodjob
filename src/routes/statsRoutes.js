// src/routes/statsRoutes.js
const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { query } = require('express-validator');
const validationMiddleware = require('../middlewares/validationMiddleware');

/**
 * @swagger
 * tags:
 *   name: Stats
 *   description: 통계 관련 API
 */

/**
 * @swagger
 * /stats/company-jobs:
 *   get:
 *     summary: 회사별 공고 수 조회
 *     tags: [Stats]
 *     description: 등록된 회사별 공고 개수를 조회합니다.
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *                   additionalProperties:
 *                     type: number
 *                   example:
 *                     "삼성전자": 12
 *                     "네이버": 5
 */
router.get('/company-jobs', statsController.getCompanyJobs);

/**
 * @swagger
 * /stats/job-sector-distribution:
 *   get:
 *     summary: 직무 분야별 공고 분포 조회
 *     tags: [Stats]
 *     description: 각 직무 분야별 공고 수를 반환합니다.
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *                   additionalProperties:
 *                     type: number
 *                   example:
 *                     "백엔드": 10
 *                     "프론트엔드": 7
 */
router.get('/job-sector-distribution', statsController.getJobSectorDistribution);

/**
 * @swagger
 * /stats/recent-applications:
 *   get:
 *     summary: 최근 X일간 지원 수 조회
 *     tags: [Stats]
 *     description: 최근 X일동안 발생한 지원 수를 조회합니다.
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *         description: 조회할 일 수 (기본값:7)
 *     responses:
 *       200:
 *         description: 성공
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
 *                     days:
 *                       type: integer
 *                     applicationCount:
 *                       type: integer
 *                   example:
 *                     days: 7
 *                     applicationCount: 30
 */
router.get('/recent-applications',
  query('days').optional().isInt({ min:1 }).withMessage('days는 1 이상의 정수여야 합니다.'),
  validationMiddleware,
  statsController.getRecentApplications
);

module.exports = router;
