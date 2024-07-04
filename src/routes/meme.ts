import express from 'express';

import {
  deleteMeme,
  getMemeWithKeywords,
  updateMeme,
  createMeme,
  getTodayMemeList,
  getAllMemeList,
  searchMemeByKeyword,
  createMemeShare,
  createMemeSave,
  createMemeReaction,
  createMemeWatch,
} from '../controller/meme.controller';
import {
  getRequestedMemeInfo,
  getKeywordInfoByName,
  getRequestedUserInfo,
} from '../middleware/requestedInfo';

const router = express.Router();

/**
 * @swagger
 * /api/meme/list:
 *   get:
 *     tags: [Meme]
 *     summary: meme 목록
 *     description: meme 목록를 반환합니다
 *     responses:
 *       200:
 *         description: meme 목록
 *       500:
 *         description: meme 목록
 *   parameters:
 *     - in: query
 *       name: page
 *       schema:
 *         type: number
 *       description: PAGE
 *     - in: query
 *       name: size
 *       schema:
 *         type: number
 *       description: SIZE
 *     - in: query
 *       name: keyword
 *       schema:
 *         type: string
 *       description: KEYWORD
 *     - in: query
 *
 */
router.get('/list', getAllMemeList); // meme 목록 전체 조회

/**
 * @swagger
 * /api/meme/todayMeme:
 *   get:
 *     tags: [Meme]
 *     summary: 오늘의 추천 밈
 *     description: 오늘의 추천 밈를 반환합니다
 *     responses:
 *       200:
 *         description: 오늘의 추천 밈
 *       500:
 *         description: 오늘의 추천 밈
 */
router.get('/todayMeme', getTodayMemeList); // 오늘의 추천 밈 (5개)

/**
 * @swagger
 * /api/meme:
 *   post:
 *     tags: [Meme]
 *     summary: meme 생성
 *     description: meme를 생성합니다
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               keywordIds: { type: array }
 *               image: { type: string }
 *               source: { type: string }
 *     responses:
 *       201:
 *         description: meme를 만들어진다.
 *       400:
 *         description: meme를 만들어진다.
 *       404:
 *         description: meme를 만들어진다.
 *       500:
 *         description: meme를 만들어진다.
 */
router.post('/', createMeme); // meme 생성

/**
 * @swagger
 * /api/meme/{memeId}:
 *   get:
 *     tags: [Meme]
 *     summary: meme
 *     description: meme
 *     parameters:
 *     - in: path
 *       name: memeId
 *       schema:
 *         type: string
 *       description: memeId
 *     responses:
 *       200:
 *         description: meme
 *       500:
 *         description: meme
 *       404:
 *         description: meme
 *       400:
 *         description: meme
 *   patch:
 *     tags: [Meme]
 *     summary: meme
 *     description: meme
 *     parameters:
 *     - in: path
 *       name: memeId
 *       schema:
 *         type: string
 *       description: memeId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               keywordIds: { type: array }
 *               image: { type: string }
 *               source: { type: string }
 *     responses:
 *       200:
 *         description: meme
 *       500:
 *         description: meme
 *       404:
 *         description: meme
 *       400:
 *         description: meme
 *   delete:
 *     tags: [Meme]
 *     summary: meme
 *     description: meme
 *     parameters:
 *     - in: path
 *       name: memeId
 *       schema:
 *         type: string
 *       description: memeId
 *     responses:
 *       200:
 *         description: meme
 *       500:
 *         description: meme
 *       404:
 *         description: meme
 *       400:
 *         description: meme
 */
router.get('/:memeId', getMemeWithKeywords); // meme 조회
router.patch('/:memeId', getRequestedMemeInfo, updateMeme); // meme 수정
router.delete('/:memeId', getRequestedMemeInfo, deleteMeme); // meme 삭제

/**
 * @swagger
 * /api/meme/{memeId}/save:
 *   post:
 *     tags: [Meme]
 *     summary: meme 저장
 *     description: meme 저장
 *     parameters:
 *     - in: path
 *       name: memeId
 *       schema:
 *         type: string
 *       description: memeId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId: { type: string }
 *               memeId: { type: string }
 *     responses:
 *       200:
 *         description: meme
 *       500:
 *         description: meme
 *       404:
 *         description: meme
 *       400:
 *         description: meme
 */
router.post('/:memeId/save', getRequestedMemeInfo, getRequestedUserInfo, createMemeSave);

/**
 * @swagger
 * /api/meme/{memeId}/share:
 *   post:
 *     tags: [Meme]
 *     summary: meme 공유
 *     description: meme 공유
 *     parameters:
 *     - in: path
 *       name: memeId
 *       schema:
 *         type: string
 *       description: memeId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId: { type: string }
 *               memeId: { type: string }
 *     responses:
 *       200:
 *         description: meme
 *       500:
 *         description: meme
 *       404:
 *         description: meme
 *       400:
 *         description: meme
 */
router.post('/:memeId/share', getRequestedMemeInfo, getRequestedUserInfo, createMemeShare);

/**
 * @swagger
 * /api/meme/{memeId}/watch:
 *   post:
 *     tags: [Meme]
 *     summary: meme 보기
 *     description: meme 보기
 *     parameters:
 *     - in: path
 *       name: memeId
 *       schema:
 *         type: string
 *       description: memeId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId: { type: string }
 *               memeId: { type: string }
 *     responses:
 *       200:
 *         description: meme
 *       500:
 *         description: meme
 *       404:
 *         description: meme
 */
router.post('/:memeId/watch/:type', getRequestedMemeInfo, getRequestedUserInfo, createMemeWatch);

/**
 * @swagger
 * /api/meme/{memeId}/reaction:
 *   post:
 *     tags: [Meme]
 *     summary: meme 방문
 *     description: meme 방문
 *     parameters:
 *     - in: path
 *       name: memeId
 *       schema:
 *         type: string
 *       description: memeId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId: { type: string }
 *               memeId: { type: string }
 *     responses:
 *       200:
 *         description: meme
 *       500:
 *         description: meme
 *       404:
 *         description: meme
 */
router.post('/:memeId/reaction', getRequestedMemeInfo, getRequestedUserInfo, createMemeReaction);

/**
 * @swagger
 * /api/meme/search/{name}:
 *   get:
 *     tags: [Meme]
 *     summary: meme 검색
 *     description: meme 검색
 *     parameters:
 *     - in: path
 *       name: name
 *       schema:
 *         type: string
 *       description: name
 *     responses:
 *       200:
 *         description: meme
 *       500:
 *         description: meme
 *       404:
 *         description: meme
 *       400:
 *         description: meme
 */
router.get('/search/:name', getKeywordInfoByName, searchMemeByKeyword);

export default router;
