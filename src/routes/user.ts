import express from 'express';

import * as UserController from '../controller/user.controller';
import { getRequestedUserInfo } from '../middleware/requestedInfo';

const router = express.Router();

/**
 *  @swagger
 *  /api/user:
 *    post:
 *      tags: [User]
 *      summary: 유저 생성
 *      description: 유저를 생성한다.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                deviceId:
 *                  type: string
 *                  example: abcdefgh
 *                  description: 유저의 디바이스 아이디
 *      responses:
 *        '200':
 *          description: user
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: success
 *                  code:
 *                    type: integer
 *                    example: 200
 *                  message:
 *                    type: string
 *                    example: user created
 *                  data:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                        example: "66805b1372ef94c9c0ba1349"
 *                      deviceId:
 *                        type: string
 *                        example: "deviceId"
 *                        description: 유저의 deviceId
 *                      lastSeenMeme:
 *                        type: array
 *                        description: 최근에 본 밈 id (최대 10개)
 *                        items:
 *                          type: string
 *                          example: "66805b1a72ef94c9c0ba134c"
 *                        default: []
 *                      isDeleted:
 *                        type: boolean
 *                        example: false
 *                      watch:
 *                        type: integer
 *                        example: 0
 *                      reaction:
 *                        type: integer
 *                        example: 0
 *                      save:
 *                        type: integer
 *                        example: 0
 *                      share:
 *                        type: integer
 *                        example: 0
 *                      memeRecommendWatchCount:
 *                        type: integer
 *                        example: 0
 *                      level:
 *                        type: integer
 *                        example: 1
 *        400:
 *          description: deviceId field should be provided
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: error
 *                  code:
 *                    type: integer
 *                    example: 400
 *                  message:
 *                    type: string
 *                    example: deviceId field should be provided
 *                  data:
 *                    type: null
 *                    example: null
 *        500:
 *          description: Internal server error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: error
 *                  code:
 *                    type: integer
 *                    example: 500
 *                  message:
 *                    type: string
 *                    example:
 *                      Internal server error
 *                  data:
 *                    type: null
 *                    example: null
 */
router.post('/', UserController.createUser); // user 생성

/**
 * @swagger
 * /api/user:
 *   get:
 *     tags: [User]
 *     summary: 유저 정보 조회
 *     description: 유저 정보 조회
 *     parameters:
 *     - name: x-device-id
 *       in: header
 *       description: 유저의 고유한 deviceId
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: get user
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
 *                   example: Found User
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "5f6f6b1d6ab9c8f7d9a4b5c6"
 *                     deviceId:
 *                       type: string
 *                       example: "deviceId"
 *                     lastSeenMeme:
 *                       type: array
 *                       description: 최근에 본 밈 id (최대 10개)
 *                       items:
 *                         type: string
 *                         example: "66805b1a72ef94c9c0ba134c"
 *                       default: []
 *                     isDeleted:
 *                       type: boolean
 *                       example: false
 *                     watch:
 *                       type: integer
 *                       example: 0
 *                     reaction:
 *                       type: integer
 *                       example: 0
 *                     save:
 *                       type: integer
 *                       example: 0
 *                     share:
 *                       type: integer
 *                       example: 0
 *                     memeRecommendWatchCount:
 *                       type: integer
 *                       example: 0
 *                     level:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: deviceId should be provided
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
 *                   example: deviceId should be provided
 *                 data:
 *                   type: null
 *                   example: null
 */
router.get('/', getRequestedUserInfo, UserController.getUser); // user 조회

/**
 * @swagger
 * /api/user/saved-memes:
 *   get:
 *     tags: [User]
 *     summary: 사용자가 저장한 밈 목록 조회 (나의 파밈함) - 페이지네이션
 *     description: 사용자가 저장한 밈 목록 (나의 파밈함)
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
 *       - name: x-device-id
 *         in: header
 *         description: 유저의 고유한 deviceId
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: 사용자가 저장한 밈 목록 조회
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
 *                   example: Get saved Meme List
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
 *                           image:
 *                             type: string
 *                             example: "https://ppac-meme.s3.ap-northeast-2.amazonaws.com/17207029441190.png"
 *                           isTodayMeme:
 *                             type: boolean
 *                             example: false
 *                           isSaved:
 *                             type: boolean
 *                             example: true
 *                           isReaction:
 *                             type: boolean
 *                             example: true
 *                           keywords:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 _id:
 *                                   type: string
 *                                   example: "5f6f6b1d6ab9c8f7d9a4b5c6"
 *                                 title:
 *                                   type: string
 *                                   example: "무한도전"
 *                           title:
 *                             type: string
 *                             example: "무한상사 정총무"
 *                           source:
 *                             type: string
 *                             example: "무한도전 102화"
 *                           reaction:
 *                             type: integer
 *                             example: 99
 *                             description: 밈 리액션 수
 *                           watch:
 *                             type: integer
 *                             example: 999
 *                             description: 조회 수
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-06-29T19:06:02.489Z"
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-06-29T19:06:02.489Z"
 *       400:
 *         description: deviceId should be provided
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
 *                   example: deviceId should be provided
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
 *                   example:
 *                     - Internal server error
 *                 data:
 *                   type: null
 *                   example: null
 */
router.get('/saved-memes', getRequestedUserInfo, UserController.getSavedMemeList); // user가 저장한 meme 조회 (페이지네이션 적용)

/**
 * @swagger
 * /api/user/recent-memes:
 *   get:
 *     tags: [User]
 *     summary: 사용자가 최근에 본 밈 정보 조회 (최근 본 밈)
 *     description: 사용자가 최근에 본 밈 정보 조회 (최근 본 밈)
 *     parameters:
 *     - name: x-device-id
 *       in: header
 *       description: 유저의 고유한 deviceId
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: 최근에 본 밈 목록
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
 *                   example: Get Last Seen Meme
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "66805b1a72ef94c9c0ba134c"
 *                       image:
 *                         type: string
 *                         example: "https://ppac-meme.s3.ap-northeast-2.amazonaws.com/17207029441190.png"
 *                       isTodayMeme:
 *                         type: boolean
 *                         example: false
 *                       isSaved:
 *                         type: boolean
 *                         example: false
 *                       isReaction:
 *                         type: boolean
 *                         example: false
 *                       keywords:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               example: "667fee7ac58681a42d57dc3b"
 *                             name:
 *                               type: string
 *                               example: "무한도전"
 *                       title:
 *                         type: string
 *                         example: "무한상사 정총무"
 *                       source:
 *                         type: string
 *                         example: "무한도전 102화"
 *                       reaction:
 *                         type: integer
 *                         example: 99
 *                         description: 밈 리액션 수
 *                       watch:
 *                         type: integer
 *                         example: 999
 *                         description: 밈 조회수
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-06-29T19:06:02.489Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-06-29T19:06:02.489Z"
 *       400:
 *         description: deviceId should be provided
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
 *                   example: deviceId should be provided
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
 *                   example:
 *                     - Internal server error
 *                 data:
 *                   type: null
 *                   example: null
 */
router.get('/recent-memes', getRequestedUserInfo, UserController.getLastSeenMemeList); // user가 최근에 본 밈 정보 조회 (10개 제한)

export default router;
