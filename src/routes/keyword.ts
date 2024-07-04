import express from 'express';

import {
  createKeyword,
  getTopKeywords,
  deleteKeyword,
  updateKeyword,
  increaseSearchCount,
  getRecommendedKeywords,
} from '../controller/keyword.controller';
import { validateCategory, validateKeywordDulication } from '../middleware/duplicateValidator';
import { getKeywordInfoByName, getKeywordInfoById } from '../middleware/requestedInfo';
import { loggerMiddleware } from '../util/logger';

const router = express.Router();

router.use(loggerMiddleware);

/**
 * @swagger
 * /api/keyword:
 *   post:
 *     tags: [Keyword]
 *     summary: 키워드 생성
 *     description: 키워드를 생성합니다
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               category: { type: string }
 *     responses:
 *       201:
 *         description: 키워드를 만들어진다.
 *       400:
 *         description: 키워드를 만들어진다.
 *       409:
 *         description: 키워드를 만들어진다.
 *       500:
 *         description: 키워드를 만들어진다.
 *       501:
 *         description: 키워드를 만들어진다.
 */
/**
 * @swagger
 * /api/keyword/{keywordId}:
 *   put:
 *     tags: [Keyword]
 *     summary: 키워드 수정
 *     description: 키워드를 수정합니다
 *     parameters:
 *       - in: path
 *         name: keywordId
 *         required: true
 *         schema:
 *           type: string
 *         description: 키워드 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               category: { type: string }
 *     responses:
 *       200:
 *         description: 키워드를 수정해야다.
 *       400:
 *         description: 키워드를 만들어진다.
 *       404:
 *         description: 키워드를 만들어진다.
 *       500:
 *         description: 키워드를 만들어진다.
 *       501:
 *         description: 키워드를 만들어진다.
 *   delete:
 *     tags: [Keyword]
 *     summary: 키워드 삭제
 *     description: 키워드를 삭제합니다
 *     parameters:
 *       - in: path
 *         name: keywordId
 *         required: true
 *         schema:
 *           type: string
 *         description: 키워드 ID
 *     responses:
 *       200:
 *         description: 키워드를 삭제해야다.
 *       404:
 *         description: 키워드를 만들어진다.
 *       500:
 *         description: 키워드를 만들어진다.
 *       501:
 *         description: 키워드를 만들어진다.
 */
router.post('/', validateCategory, validateKeywordDulication, createKeyword);
router.put('/:keywordId', getKeywordInfoById, updateKeyword);
router.delete('/:keywordId', getKeywordInfoById, deleteKeyword);

/**
 * @swagger
 * /api/keyword/top:
 *   get:
 *     tags: [Keyword]
 *     summary: 키워드 목록
 *     description: 키워드 목록를 반환합니다
 *     responses:
 *       200:
 *         description: 키워드 목록
 *       500:
 *         description: 키워드 목록
 */
router.get('/top', getTopKeywords); // 인기 키워드 조회

/**
 * @swagger
 * /api/keyword/count:
 *   patch:
 *     tags: [Keyword]
 *     summary: 키워드 검색
 *     description: 키워드 검색
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *     responses:
 *       200:
 *         description: 키워드 검색
 *       500:
 *         description: 키워드 검색
 *       501:
 *         description: 키워드 검색
 */
router.patch('/count', getKeywordInfoByName, increaseSearchCount); // 키워드 조회수 업데이트

/**
 * @swagger
 * /api/keyword/recommend:
 *   get:
 *     tags: [Keyword]
 *     summary: 키워드 추천
 *     description: 키워드 추천
 *     responses:
 *       200:
 *         description: 키워드 추천
 *       500:
 *         description: 키워드 추천
 */
router.get('/recommend', getRecommendedKeywords);
export default router;
