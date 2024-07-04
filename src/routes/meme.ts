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
 * /api/meme:
 *   get:
 *     tags:
 *       - Meme
 *     summary: Get all meme
 *     description: Retrieve a list of all memes
 *     responses:
 *       '200':
 *         description: A list of memes
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
 *                   example: Get all meme list
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
 */
router.get('/list', getAllMemeList); // meme 목록 전체 조회

/**
 * @swagger
 * /api/meme/todayMeme:
 *   get:
 *     tags: [Meme]
 *     summary: Get today's meme list
 *     description: Get a list of today's 6 memes
 *     responses:
 *       200:
 *         description: Get a list of today's 6 memes
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
 */
router.get('/todayMeme', getTodayMemeList); // 오늘의 추천 밈 (5개)

/**
 * @swagger
 * /api/meme:
 *   post:
 *     tags: [Meme]
 *     summary: Create a new meme
 *     description: Create a new meme with title, image, source, and keywordIds
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Funny Meme"
 *                 description: The title of the meme
 *               image:
 *                 type: string
 *                 example: "https://example.com/meme.jpg"
 *                 description: URL of the meme image
 *               source:
 *                 type: string
 *                 example: "Internet"
 *                 description: Source of the meme
 *               keywordIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "667fee6dc58681a42d57dc37"
 *                   description: Array of keyword IDs associated with the meme
 *     responses:
 *       201:
 *         description: The created meme
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
 *                     title:
 *                       type: string
 *                       example: "Funny Meme"
 *                       description: The title of the meme
 *                     image:
 *                       type: string
 *                       example: "https://example.com/meme.jpg"
 *                       description: URL of the meme image
 *                     source:
 *                       type: string
 *                       example: "Internet"
 *                       description: Source of the meme
 *                     keywordIds:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "667fee6dc58681a42d57dc37"
 *                         description: Array of keyword IDs associated with the meme
 *                     reaction:
 *                       type: integer
 *                       example: 0
 *                       description: Number of reactions for the meme
 *                     isTodayMeme:
 *                       type: boolean
 *                       example: false
 *                       description: Indicates if the meme is for today
 *                     isDeleted:
 *                       type: boolean
 *                       example: false
 *                       description: Indicates if the meme is deleted
 *                     _id:
 *                       type: string
 *                       example: "6686af56f7c49ec21e3ef1c1"
 *                       description: The ID of the created meme
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-07-04T14:19:02.918Z"
 *                       description: Timestamp when the meme was created
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-07-04T14:19:02.918Z"
 *                       description: Timestamp when the meme was last updated
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
 *                   example: title field should be provided
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
 */
router.post('/', createMeme); // meme 생성

/**
 * @swagger
 * /api/meme/{memeId}:
 *   get:
 *     tags: [Meme]
 *     summary: get memeInfo with keywords
 *     description: get memeInfo with keywords
 *     parameters:
 *     - in: path
 *       name: memeId
 *       required: true
 *       schema:
 *         type: string
 *       description: The ID of the meme
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
 *                       example: "title1"
 *                     image:
 *                       type: string
 *                       example: "image1"
 *                     reaction:
 *                       type: integer
 *                       example: 0
 *                     source:
 *                       type: string
 *                       example: "source1"
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
 *                         example: "angry"
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
 */
router.get('/:memeId', getMemeWithKeywords); // meme 조회
/**
 * @swagger
 * /api/meme/{memeId}:
 *   patch:
 *     tags: [Meme]
 *     summary: Update a meme
 *     description: Update a meme with the specified memeId
 *     parameters:
 *     - in: path
 *       name: memeId
 *       schema:
 *         type: string
 *       required: true
 *       description: The ID of the meme to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               image:
 *                 type: string
 *               source:
 *                 type: string
 *               keywordIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Updated Meme
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
 *                       description: The ID of the updated meme
 *                     title:
 *                       type: string
 *                       example: "title5"
 *                       description: The updated title of the meme
 *                     keywordIds:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "667fee7ac58681a42d57dc3b"
 *                         description: Array of updated keyword IDs associated with the meme
 *                     image:
 *                       type: string
 *                       example: "image5"
 *                       description: The updated URL of the meme image
 *                     reaction:
 *                       type: integer
 *                       example: 0
 *                       description: The updated number of reactions for the meme
 *                     source:
 *                       type: string
 *                       example: "source5"
 *                       description: The updated source of the meme
 *                     isTodayMeme:
 *                       type: boolean
 *                       example: true
 *                       description: Updated flag indicating if the meme is for today
 *                     isDeleted:
 *                       type: boolean
 *                       example: false
 *                       description: Updated flag indicating if the meme is deleted
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
 *         description: Invalid memeId or request body
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
 */
router.patch('/:memeId', getRequestedMemeInfo, updateMeme); // meme 수정

/**
 * @swagger
 * /api/meme/{memeId}:
 *   delete:
 *     tags: [Meme]
 *     summary: Delete a meme
 *     description: Delete a meme with the specified memeId
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
 */
router.delete('/:memeId', getRequestedMemeInfo, deleteMeme); // meme 삭제

/**
 * @swagger
 * /api/meme/{memeId}/save:
 *   post:
 *     tags: [Meme]
 *     summary: Save a meme for the user
 *     description: Save a meme for the user
 *     parameters:
 *     - in: path
 *       name: memeId
 *       schema:
 *         type: string
 *       description: The ID of the meme to save
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
 */
router.post('/:memeId/save', getRequestedMemeInfo, getRequestedUserInfo, createMemeSave);

/**
 * @swagger
 * /api/meme/{memeId}/share:
 *   post:
 *     tags: [Meme]
 *     summary: Share a meme
 *     description: Share a meme by the user
 *     parameters:
 *     - in: path
 *       name: memeId
 *       schema:
 *         type: string
 *       description: The ID of the meme to share
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
 */
router.post('/:memeId/share', getRequestedMemeInfo, getRequestedUserInfo, createMemeShare);

/**
 * @swagger
 * /api/meme/{memeId}/watch/{type}:
 *   post:
 *     tags: [Meme]
 *     summary: Watch a meme
 *     description: Record a user interaction with a meme (e.g., search or recommendation).
 *     parameters:
 *     - in: path
 *       name: memeId
 *       schema:
 *         type: string
 *       description: The ID of the meme to watch
 *     - in: path
 *       name: type
 *       schema:
 *         type: string
 *       enum: [search, recommend]
 *       description: The type of watch interaction (search or recommend)
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
 *                   example: Create Meme Watch or recommend Meme Watch
 *                 data:
 *                   oneOf:
 *                     - type: boolean
 *                       example: true
 *                       description: Returned when type is 'search'
 *                     - type: integer
 *                       example: 1
 *                       description: Returned when type is 'recommend'
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
 */
router.post('/:memeId/watch/:type', getRequestedMemeInfo, getRequestedUserInfo, createMemeWatch);
/**
 * @swagger
 * /api/meme/{memeId}/reaction:
 *   post:
 *     tags: [Meme]
 *     summary: Create a reaction for a meme
 *     description: Create a reaction (e.g., like) for the specified meme
 *     parameters:
 *     - in: path
 *       name: memeId
 *       schema:
 *         type: string
 *       required: true
 *       description: The ID of the meme to react to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deviceId:
 *                 type: string
 *                 description: The ID of the device/user reacting to the meme
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
 */
router.post('/:memeId/reaction', getRequestedMemeInfo, getRequestedUserInfo, createMemeReaction);

/**
 * @swagger
 * /api/meme/search/{name}:
 *   get:
 *     tags: [Meme]
 *     summary: Search memes by keyword
 *     description: Retrieve memes associated with a specific keyword
 *     parameters:
 *     - in: path
 *       name: name
 *       schema:
 *         type: string
 *       required: true
 *       description: The name of the keyword to search for
 *     responses:
 *       200:
 *         description: A list of memes associated with the keyword
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
 *                         example: "title5"
 *                       keywordIds:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               example: "667fee7ac58681a42d57dc3b"
 *                             name:
 *                               type: string
 *                               example: "pig"
 *                       image:
 *                         type: string
 *                         example: "image5"
 *                       reaction:
 *                         type: integer
 *                         example: 0
 *                       source:
 *                         type: string
 *                         example: "source5"
 *                       isTodayMeme:
 *                         type: boolean
 *                         example: true
 *                       isDeleted:
 *                         type: boolean
 *                         example: false
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
 */
router.get('/search/:name', getKeywordInfoByName, searchMemeByKeyword);

export default router;
