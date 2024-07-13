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

const router = express.Router();

/**
 * @swagger
 * /api/keyword:
 *   post:
 *     tags: [Keyword]
 *     summary: 키워드 생성 (백오피스)
 *     description: 키워드를 생성한다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 example: "감정"
 *               name:
 *                 type: string
 *                 example: "웃긴"
 *     responses:
 *       201:
 *         description: Successfully created a new keyword
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Created Keyword
 *                 data:
 *                   type: object
 *                   properties:
 *                     category:
 *                       type: string
 *                       example: "감정"
 *                     keyword:
 *                       type: string
 *                       example: "웃긴"
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: category field should be provided
 *                 data:
 *                   type: null
 *                   example: null
 */
router.post('/', validateCategory, validateKeywordDulication, createKeyword);

/**
 * @swagger
 * /api/keyword/{keywordId}:
 *   put:
 *     tags: [Keyword]
 *     summary: 키워드 업데이트 (백오피스)
 *     description: 키워드 정보를 업데이트한다.
 *     parameters:
 *       - in: path
 *         name: keywordId
 *         required: true
 *         description: 키워드 id
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 example: "감정"
 *               keyword:
 *                 type: string
 *                 example: "슬픔"
 *     responses:
 *       200:
 *         description: 키워드 업데이트 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Update Keyword
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "66880f7ee341b999bc14e896"
 *                     name:
 *                       type: string
 *                       example: "happy"
 *                     category:
 *                       type: string
 *                       example: "test"
 *                     searchCount:
 *                       type: integer
 *                       example: 0
 *                     createdAt:
 *                       type: string
 *                       example: "2024-07-05T15:21:34.012Z"
 *                     updatedAt:
 *                       type: string
 *                       example: "2024-07-05T16:03:22.057Z"
 *       404:
 *         description: 존재하지않는 키워드
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Keyword with name 감정` does not exist
 *                 data:
 *                   type: null
 *                   example: null
 */
router.put('/:keywordId', getKeywordInfoById, updateKeyword);

/**
 * @swagger
 * /api/keyword/{keywordId}:
 *   delete:
 *     tags: [Keyword]
 *     summary: 키워드 삭제 (백오피스)
 *     description: 키워드를 삭제한다. (백오피스)
 *     parameters:
 *       - in: path
 *         name: keywordId
 *         required: true
 *         description: 삭제할 키워드 id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 키워드 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Delete Keyword
 *                 data:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: 존재하지않는 키워드
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Keyword(66880f7ee341b999bc14e896) does not exist
 *                 data:
 *                   type: null
 *                   example: null
 */
router.delete('/:keywordId', getKeywordInfoById, deleteKeyword);

/**
 * @swagger
 * /api/keyword/top:
 *   get:
 *     tags: [Keyword]
 *     summary: 인기 키워드 조회
 *     description: 인기 키워드 조회 (조회수)
 *     responses:
 *       200:
 *         description: 인기 키워드 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Get Top Keywords
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "66880f7ee341b999bc14e896"
 *                       name:
 *                         type: string
 *                         example: "행복"
 *                       category:
 *                         type: string
 *                         example: "감정"
 *                       searchCount:
 *                         type: integer
 *                         example: 100
 *                       topReactionImage:
 *                         type: string
 *                         example: "https://ppac-meme.s3.ap-northeast-2.amazonaws.com/17207029441190.png"
 *                       createdAt:
 *                         type: string
 *                         example: "2024-07-05T15:21:34.012Z"
 *                       updatedAt:
 *                         type: string
 *                         example: "2024-07-05T16:03:22.057Z"
 *       400:
 *         description: Invalid query parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Invalid query parameter
 *                 data:
 *                   type: null
 *                   example: null
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Failed to get top reaction image
 *                 data:
 *                   type: null
 *                   example: null
 */
router.get('/top', getTopKeywords);

/**
 * @swagger
 * /api/keyword/count:
 *   patch:
 *     tags: [Keyword]
 *     summary: 키워드 조회수 업데이트
 *     description: 키워드 조회수 업데이트하기
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "슬픈"
 *     responses:
 *       200:
 *         description: Successfully updated keyword search count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Increase search Count for keyword
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "66880f7ee341b999bc14e896"
 *                       name:
 *                         type: string
 *                         example: "긁"
 *                       category:
 *                         type: string
 *                         example: "상황"
 *                       searchCount:
 *                         type: integer
 *                         example: 1
 *                       createdAt:
 *                         type: string
 *                         example: "2024-07-05T15:21:34.012Z"
 *                       updatedAt:
 *                         type: string
 *                         example: "2024-07-05T16:03:22.057Z"
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Invalid request body
 *                 data:
 *                   type: null
 *                   example: null
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 data:
 *                   type: null
 *                   example: null
 */
router.patch('/count', getKeywordInfoByName, increaseSearchCount);

/**
 * @swagger
 * /api/keyword/recommend:
 *   get:
 *     tags: [Keyword]
 *     summary: 무슨 밈 찾아? 키워드 카테고리, 키워드 목록
 *     description: 무슨 밈 찾아? 키워드 카테고리, 키워드 목록 출력
 *     responses:
 *       200:
 *         description: 추천 키워드 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Get Recommended Keywords
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       category:
 *                         type: string
 *                         example: "상황"
 *                       keywords:
 *                         type: object
 *                         properties:
 *                           _id:
 *                              type: string
 *                              example: "667ff3d1239eeaf78630a283"
 *                           name:
 *                              type: string
 *                              example: "웃긴"
 *               name:
 *                 type: string
 *                 example: "웃긴"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 data:
 *                   type: null
 *                   example: null
 */
router.get('/recommend', getRecommendedKeywords);

export default router;
