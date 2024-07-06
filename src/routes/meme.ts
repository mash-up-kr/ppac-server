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
 *     tags:
 *       - Meme
 *     summary: 밈 전체 목록 조회
 *     description: 밈 전체 목록 조회
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           example: 1
 *           description: 현재 페이지 번호 (기본값 1)
 *       - in: query
 *         name: size
 *         schema:
 *           type: number
 *           example: 10
 *           description: 한 번에 조회할 밈 개수 (기본값 10)
 *     responses:
 *       '200':
 *         description: 밈 목록
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
 *                   example: 밈 전체 목록 조회
 *                 data:
 *                   type: object
 *                   properties:
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           example: 2
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         perPage:
 *                           type: integer
 *                           example: 10
 *                         currentPage:
 *                           type: integer
 *                           example: 1
 *                         totalPages:
 *                           type: integer
 *                           example: 1
 *                     memeList:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "66805b1a72ef94c9c0ba134c"
 *                           title:
 *                             type: string
 *                             example: "title2"
 *                           image:
 *                             type: string
 *                             example: "image2"
 *                           reaction:
 *                             type: integer
 *                             example: 0
 *                           source:
 *                             type: string
 *                             example: "source2"
 *                           isTodayMeme:
 *                             type: boolean
 *                             example: false
 *                           isDeleted:
 *                             type: boolean
 *                             example: false
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-06-29T19:06:02.489Z"
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-06-29T19:06:02.489Z"
 *       '400':
 *         description: Invalid request parameters
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
 *                   example: Invalid 'page' parameter
 *                 data:
 *                   type: null
 *                   example: null
 *       '500':
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
router.get('/list', getAllMemeList); // meme 목록 전체 조회

/**
 * @swagger
 * /api/meme/todayMeme:
 *   get:
 *     tags: [Meme]
 *     summary: 추천 밈 정보 조회
 *     description: 추천 밈 목록을 조회한다. (현재는 주 단위, 추후 일 단위로 변경될 수 있음)
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               size:
 *                 type: number
 *                 example: 5
 *                 description: 추천 밈 개수 / 기본값 5, body를 넘기지않으면 자동으로 서버에서 5로 설정 후 5개 조회
 *     responses:
 *       200:
 *         description: 추천 밈 목록 조회 성공
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
 *                   example: Get today meme list
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "66805b1372ef94c9c0ba1349"
 *                       title:
 *                         type: string
 *                         example: "title1"
 *                       image:
 *                         type: string
 *                         example: "image1"
 *                       reaction:
 *                         type: integer
 *                         example: 0
 *                       source:
 *                         type: string
 *                         example: "source1"
 *                       isTodayMeme:
 *                         type: boolean
 *                         example: true
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-06-29T19:05:55.638Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-06-29T19:05:55.638Z"
 *                       keywords:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: "angry"
 *       400:
 *         description: Invalid request parameters
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
 *                   example: Invalid 'size' parameter. Today Meme max size is 5.
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
router.get('/todayMeme', getTodayMemeList); // 오늘의 추천 밈 (5개)

/**
 * @swagger
 * /api/meme:
 *   post:
 *     tags: [Meme]
 *     summary: 밈 생성 (백오피스)
 *     description: 밈을 생성한다. (백오피스)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "무한도전 정총무"
 *                 description: 밈 제목
 *               image:
 *                 type: string
 *                 example: "https://example.com/meme.jpg"
 *                 description: 밈 이미지 주소
 *               source:
 *                 type: string
 *                 example: "무한도전 102화"
 *                 description: 밈 출처
 *               keywordIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "667fee6dc58681a42d57dc37"
 *                   description: 밈의 키워드 id 목록
 *     responses:
 *       201:
 *         description: 생성된 밈 정보
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
 *                   example: Create Meme
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "6686af56f7c49ec21e3ef1c1"
 *                       description: 밈 id
 *                     title:
 *                       type: string
 *                       example: "무한도전 정총무"
 *                       description: 밈 제목
 *                     image:
 *                       type: string
 *                       example: "https://example.com/meme.jpg"
 *                       description: 밈 이미지 주소
 *                     source:
 *                       type: string
 *                       example: "무한도전 102화"
 *                       description: 밈 출처
 *                     keywordIds:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "667fee6dc58681a42d57dc37"
 *                         description: 밈의 키워드 id 목록
 *                     reaction:
 *                       type: integer
 *                       example: 0
 *                       description: ㅋㅋㅋ 리액션 수 (생성 시 기본값 0)
 *                     isTodayMeme:
 *                       type: boolean
 *                       example: false
 *                       description: 추천 밈 여부
 *                     isDeleted:
 *                       type: boolean
 *                       example: false
 *                       description: 밈 삭제 여부
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-07-04T14:19:02.918Z"
 *                       description: 생성 시각
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-07-04T14:19:02.918Z"
 *                       description: 업데이트 시각
 *       400:
 *         description: 잘못된 요청 - requestBody 형식 확인 필요
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
 *                   example: title field should be provided
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
router.post('/', createMeme); // meme 생성

/**
 * @swagger
 * /api/meme/{memeId}:
 *   get:
 *     tags: [Meme]
 *     summary: 밈 정보 조회(키워드 포함)
 *     description: 밈 정보를 조회한다. 밈의 키워드 정보도 함께 포함한다. 이때 키워드는 키워드명만 제공된다 (키워드의 개별 정보 X)
 *     parameters:
 *     - in: path
 *       name: memeId
 *       required: true
 *       schema:
 *         type: string
 *       description: 밈 ID
 *     responses:
 *       200:
 *         description: The meme
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
 *                   example: Get Meme
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "66805b1372ef94c9c0ba1349"
 *                     title:
 *                       type: string
 *                       example: "무한도전 정총무"
 *                     image:
 *                       type: string
 *                       example: "https://example.com/meme.jpg"
 *                     reaction:
 *                       type: integer
 *                       example: 0
 *                     source:
 *                       type: string
 *                       example: "무한도전 102화"
 *                     isTodayMeme:
 *                       type: boolean
 *                       example: false
 *                     isDeleted:
 *                       type: boolean
 *                       example: false
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-06-29T19:05:55.638Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-06-29T19:05:55.638Z"
 *                     keywords:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example:
 *                           - "무한상사"
 *                           - "정총무"
 *                           - "전자두뇌"
 *       400:
 *         description: Bad Request
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
 *                   example: 'memeId field should be provided'
 *                 data:
 *                   type: null
 *                   example: null
 *       404:
 *         description: Meme not found
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
 *                   example: 'Meme(memeId) not found.'
 *                 data:
 *                   type: null
 *                   example: null
 *       500:
 *         description: Internal Server Error
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
 *                   example: 'Internal Server Error'
 *                 data:
 *                   type: null
 *                   example: null
 */
router.get('/:memeId', getMemeWithKeywords); // meme 조회

/**
 * @swagger
 * /api/meme/{memeId}:
 *   patch:
 *     tags: [Meme]
 *     summary: 밈 수정(백오피스)
 *     description: 밈을 수정한다 (백오피스)
 *     parameters:
 *     - in: path
 *       name: memeId
 *       schema:
 *         type: string
 *       required: true
 *       description: 수정할 밈 id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "무한도전 정총무 2탄"
 *                 description: 밈 제목
 *               image:
 *                 type: string
 *                 example: "https://example.com/meme.jpg"
 *                 description: 밈 이미지 주소
 *               source:
 *                 type: string
 *                 example: "무한도전 103화"
 *                 description: 밈 출처
 *               keywordIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "667fee6dc58681a42d57dc37"
 *                   description: 밈의 키워드 id 목록
 *     responses:
 *       200:
 *         description: 수정된 밈 정보
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
 *                   example: Updated Meme
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "6686b064aa47d3ef168cd078"
 *                       description: 밈 id
 *                     title:
 *                       type: string
 *                       example: "무한도전 정총무"
 *                       description: 밈 제목
 *                     image:
 *                       type: string
 *                       example: "https://example.com/meme.jpg"
 *                       description: 밈 이미지 주소
 *                     source:
 *                       type: string
 *                       example: "source5"
 *                       description: The updated source of the meme
 *                     keywordIds:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "667fee7ac58681a42d57dc3b"
 *                         description: 밈의 키워드 id 목록
 *                     reaction:
 *                       type: integer
 *                       example: 0
 *                       description: ㅋㅋㅋ 리액션 수 (생성 시 기본값 0)
 *                     isTodayMeme:
 *                       type: boolean
 *                       example: true
 *                       description: 추천 밈 여부
 *                     isDeleted:
 *                       type: boolean
 *                       example: false
 *                       description: 밈 삭제 여부
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-07-04T14:23:32.755Z"
 *                       description: Timestamp when the meme was created
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-07-04T15:15:06.833Z"
 *                       description: Timestamp when the meme was last updated
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
 *                   example: Invalid 'memeId' parameter
 *                 data:
 *                   type: null
 *                   example: null
 *       404:
 *         description: Meme not found
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
 *                   example: Meme (6686b064aa47d3ef168cd078) not found
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
router.patch('/:memeId', getRequestedMemeInfo, updateMeme); // meme 수정

/**
 * @swagger
 * /api/meme/{memeId}:
 *   delete:
 *     tags: [Meme]
 *     summary: 밈 삭제(백오피스)
 *     description: 밈을 삭제한다.
 *     parameters:
 *     - in: path
 *       name: memeId
 *       schema:
 *         type: string
 *       description: The ID of the meme to delete
 *     responses:
 *       200:
 *         description: Meme successfully deleted
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
 *                   example: Deleted Meme
 *                 data:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid memeId
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
 *                   example: 'memeId is not a valid ObjectId'
 *       404:
 *         description: Meme not found
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
 *                   example: Meme(66805b1372ef94c9c0ba1349) does not exist
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
router.delete('/:memeId', getRequestedMemeInfo, deleteMeme); // meme 삭제

/**
 * @swagger
 * /api/meme/{memeId}/save:
 *   post:
 *     tags: [Meme]
 *     summary: 밈 저장 (내 파밈함에 보관됨)
 *     description: 밈을 저장한다. 저장한 밈은 내 파밈함에 보관된다.
 *     parameters:
 *     - in: path
 *       name: memeId
 *       schema:
 *         type: string
 *       description: 저장할 밈 id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deviceId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Meme successfully saved
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
 *                   example: Create Meme Save
 *                 data:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid parameters
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
 *                   example: 'deviceId should be provided'
 *                 data:
 *                   type: null
 *                   example: null
 *       404:
 *         description: Meme or user not found
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
 *                   example: Meme(66805b1372ef94c9c0ba1349) does not exist
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
router.post('/:memeId/save', getRequestedUserInfo, getRequestedMemeInfo, createMemeSave);

/**
 * @swagger
 * /api/meme/{memeId}/share:
 *   post:
 *     tags: [Meme]
 *     summary: 밈 공유
 *     description: 밈 공유할 때 사용되는 api로 '밈 공유' 카운트를 올린다.
 *     parameters:
 *     - in: path
 *       name: memeId
 *       schema:
 *         type: string
 *       description: 공유할 밈 id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deviceId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Meme successfully shared
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
 *                   example: Create Meme Share
 *                 data:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid parameters
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
 *                   example: 'deviceId should be provided'
 *                 data:
 *                   type: null
 *                   example: null
 *       404:
 *         description: Meme or user not found
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
 *                   example: Meme(66805b1372ef94c9c0ba1349) does not exist
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
router.post('/:memeId/share', getRequestedUserInfo, getRequestedMemeInfo, createMemeShare);

/**
 * @swagger
 * /api/meme/{memeId}/watch/{type}:
 *   post:
 *     tags: [Meme]
 *     summary: 밈 보기 (밈의 타입 필요)
 *     description: 사용자가 밈을 볼 때 사용되는 api로 '밈 보기' 카운트를 올린다. 밈의 타입을 적어줘야한다.
 *     parameters:
 *     - in: path
 *       name: memeId
 *       schema:
 *         type: string
 *       description: 밈 id
 *     - in: path
 *       name: type
 *       schema:
 *         type: string
 *       enum: [search, recommend]
 *       description: 밈 종류 (search - 검색으로 조회된 밈 / recommend - 추천 탭에서 조회된 밈)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deviceId:
 *                 type: string
 *                 description: The ID of the device/user
 *     responses:
 *       201:
 *         description: Meme watch interaction recorded successfully
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
 *                   example: Create Meme Watch 혹은 recommend Meme Watch
 *                 data:
 *                   oneOf:
 *                     - type: boolean
 *                       example: true
 *                       description: search 타입의 밈인 경우 밈 카운트 증가 성공 여부
 *                     - type: integer
 *                       example: 1
 *                       description: recommend 타입의 밈인 경우 추천 밈 조회 개수
 *       400:
 *         description: Invalid parameters or type
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
 *                   example: Invalid 'type' parameter.
 *                 data:
 *                   type: null
 *                   example: null
 *       404:
 *         description: Meme or user not found
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
 *                   example: Meme(66805b1372ef94c9c0ba1349) does not exist
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
router.post('/:memeId/watch/:type', getRequestedUserInfo, getRequestedMemeInfo, createMemeWatch);

/**
 * @swagger
 * /api/meme/{memeId}/reaction:
 *   post:
 *     tags: [Meme]
 *     summary: 밈 리액션(ㅋㅋㅋ)
 *     description: 밈 리액션 시 사용되는 api로 'ㅋ 남기기' 카운트를 올린다.
 *     parameters:
 *     - in: path
 *       name: memeId
 *       schema:
 *         type: string
 *       required: true
 *       description: 리액션할 밈 id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deviceId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created Meme Reaction
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
 *                   example: Create Meme Reaction
 *                 data:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid request body or missing required fields
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
 *                   example: 'deviceId should be provided'
 *       404:
 *         description: Meme not found or user not found
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
 *                   example: Meme (6686b064aa47d3ef168cd078) or user not found
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
router.post('/:memeId/reaction', getRequestedUserInfo, getRequestedMemeInfo, createMemeReaction);

/**
 * @swagger
 * /api/meme/search/{name}:
 *   get:
 *     tags: [Meme]
 *     summary: 키워드에 해당하는 밈 조회
 *     description: 키워드 클릭 시 해당 키워드를 포함한 밈을 조회하고 목록을 반환한다.
 *     parameters:
 *     - in: path
 *       name: name
 *       schema:
 *         type: string
 *         example: "행복"
 *       required: true
 *       description: 키워드명
 *     responses:
 *       200:
 *         description: 키워드를 포함한 밈 목록
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
 *                   example: Search meme by keyword
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "6686b075aa47d3ef168cd07e"
 *                       title:
 *                         type: string
 *                         example: "완전 럭키비키자나~"
 *                       keywordIds:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               example:
 *                                - "667fee7ac58681a42d57dc3b"
 *                                - "667fee7ac58681a42d57dc3d"
 *                                - "667fee7ac58681a42d57dc3v"
 *                             name:
 *                               type: string
 *                               example:
 *                                - "행복"
 *                                - "장원영"
 *                                - "럭키비키"
 *                       image:
 *                         type: string
 *                         example: "https://example.com/meme.jpg"
 *                       reaction:
 *                         type: integer
 *                         example: 0
 *                       source:
 *                         type: string
 *                         example: "유투브"
 *                       isTodayMeme:
 *                         type: boolean
 *                         example: true
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-06-29T19:05:55.638Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-06-29T19:05:55.638Z"
 *       400:
 *         description: Invalid keyword name
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
 *                   example: Keyword with name 'invalid_keyword' does not exist
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
router.get('/search/:name', getKeywordInfoByName, searchMemeByKeyword);

export default router;
