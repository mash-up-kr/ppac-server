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
 *     summary: user
 *     description: user
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
 *     summary: 사용자가 저장한 밈 정보 조회 (나의 파밈함)
 *     description: 사용자가 저장한 밈 목록 (나의 파밈함)
 *     parameters:
 *     - name: x-device-id
 *       in: header
 *       description: 유저의 고유한 deviceId
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: updated user
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "5f6f6b1d6ab9c8f7d9a4b5c6"
 *                       image:
 *                         type: string
 *                         example: "image5"
 *                       isTodayMeme:
 *                         type: boolean
 *                         example: true
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
router.get('/saved-memes', getRequestedUserInfo, UserController.getSavedMeme); // user가 저장한 meme 조회 (10개 제한)

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
 *         description: updated user
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
 *                   example: get lastSeenMeme
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "5f6f6b1d6ab9c8f7d9a4b5c6"
 *                       image:
 *                         type: string
 *                         example: "http://image5"
 *                       isTodayMeme:
 *                         type: boolean
 *                         example: true
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
router.get('/recent-memes', getRequestedUserInfo, UserController.getLastSeenMeme); // user가 최근에 본 밈 정보 조회

export default router;
