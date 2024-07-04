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
 *        400:
 *          description: user
 *        404:
 *          description: user
 *        501:
 *          description: user
 *        500:
 *          description: user
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
 *         description: user
 *       400:
 *         description: user
 *       404:
 *         description: user
 *       501:
 *         description: user
 *       500:
 *         description: user
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
 *         description: user
 *       400:
 *         description: user
 *       404:
 *         description: user
 *       501:
 *         description: user
 *       500:
 *         description: user
 */
router.get('/:deviceId/save', getRequestedUserInfo, UserController.getSavedMeme); // user가 저장한 meme 조회

export default router;
