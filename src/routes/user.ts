import express from 'express';

import * as UserController from '../controller/user.controller';
import { getRequestedUserInfo } from '../middleware/requestedInfo';

const router = express.Router();

/**
 *  @swagger
 *  /api/user:
 *    post:
 *      tags: [User]
 *      summary: user 생성
 *      description: user 생성
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                deviceId: { type: string }
 *      responses:
 *        200:
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
 *                      lastSeenMeme:
 *                        type: array
 *                        items:
 *                          type: string
 *                          example: "66805b1a72ef94c9c0ba134c"
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
 *          description: deviceId' field should be provided
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
 *                    example: deviceId' field should be provided
 *                 data:
 *                   type: null
 *                   example: null
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
 *                 data:
 *                   type: null
 *                   example: null
 */
router.post('/', UserController.createUser); // user 생성

/**
 * @swagger
 * /api/user/{deviceId}:
 *   get:
 *     tags: [User]
 *     summary: user
 *     description: user
 *     parameters:
 *     - in: path
 *       name: deviceId
 *       schema:
 *         type: string
 *       description: deviceId
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
 *                       items:
 *                         type: string
 *                         example: "66805b1a72ef94c9c0ba134c"
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
 *         description: deviceID should be provided
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
 *                   example: deviceID should be provided
 *                 data:
 *                   type: null
 *                   example: null
 */
router.get('/:deviceId', getRequestedUserInfo, UserController.getUser); // user 조회

/**
 * @swagger
 * /api/user/{deviceId}/save:
 *   get:
 *     tags: [User]
 *     summary: user
 *     description: user
 *     parameters:
 *     - in: path
 *       name: deviceId
 *       schema:
 *         type: string
 *       description: deviceId
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
 *         description: deviceID should be provided
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
 *                   example: deviceID should be provided
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
router.get('/:deviceId/save', getRequestedUserInfo, UserController.getSavedMeme); // user가 저장한 meme 조회

/**
 * @swagger
 * /api/user/{deviceId}/lastSeenMeme:
 *   get:
 *     tags: [User]
 *     summary: user
 *     description: user
 *     parameters:
 *     - in: path
 *       name: deviceId
 *       schema:
 *         type: string
 *       description: deviceId
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
 *         description: deviceID should be provided
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
 *                   example: deviceID should be provided
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
router.get('/:deviceId/lastSeenMeme', getRequestedUserInfo, UserController.getLastSeenMeme);

export default router;
