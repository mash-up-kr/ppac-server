import express from 'express';

import {
  createKeywordCategory,
  getKeywordCategory,
  updateKeywordCategory,
  deleteKeywordCategory,
} from '../controller/keywordCategory.controller';
import { validateCategoryDuplication } from '../middleware/duplicateValidator';
import { getRequestedKeywordCategoryInfo } from '../middleware/requestedInfo';

const router = express.Router();

/**
 * @swagger
 * /api/keywordCategory:
 *   post:
 *     tags: [KeywordCategory]
 *     summary: 키워드 카테고리 생성
 *     description: 키워드 카테고리를 생성합니다
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *     responses:
 *       '200':
 *         description: 키워드 카테고리 생성
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
 *                   example: Created KeywordCategory
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "5f5f5f5f5f5f5f5f5f5f5f5f"
 *                     name:
 *                       type: string
 *                       example: "meme"
 *                     isRecommend:
 *                       type: boolean
 *                       example: true
 *                     createdAt:
 *                       type: string
 *                       example: "2020-09-09T08:48:31.000Z"
 *                     updatedAt:
 *                       type: string
 *                       example: "2020-09-09T08:48:31.000Z"
 *                     isDeleted:
 *                       type: boolean
 *                       example: false
 *       '400':
 *         description: Invalid request
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
 *                   example: field should be provided
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
router.post('/', validateCategoryDuplication, createKeywordCategory);

/**
 * @swagger
 * /api/keywordCategory/{categoryName}:
 *   get:
 *     tags: [KeywordCategory]
 *     summary: 키워드 카테고리
 *     description: 키워드 카테고리를 반환합니다
 *     parameters:
 *       - in: path
 *         name: categoryName
 *         required: true
 *         schema:
 *           type: string
 *         description: 키워드 카테고리
 *     responses:
 *       200:
 *         description: 키워드 카테고리
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
 *                   example: Found KeywordCategory
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "5f5f5f5f5f5f5f5f5f5f5f5f"
 *                     name:
 *                       type: string
 *                       example: "meme"
 *                     isRecommend:
 *                       type: boolean
 *                       example: false
 *                     isDeleted:
 *                       type: boolean
 *                       example: false
 *                     createdAt:
 *                       type: string
 *                       example: "2020-09-09T08:48:31.000Z"
 *                     updatedAt:
 *                       type: string
 *                       example: "2020-09-09T08:48:31.000Z"
 *       400:
 *         description: Invalid request
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
 *                   example: field should be provided
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
 *   put:
 *     tags: [KeywordCategory]
 *     summary: 키워드 카테고리 수정
 *     description: 키워드 카테고리를 수정합니다
 *     parameters:
 *       - in: path
 *         name: categoryName
 *         required: true
 *         schema:
 *           type: string
 *         description: 키워드 카테고리
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
 *         description: 키워드 카테고리를 수정해야다.
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
 *                   example: Updated KeywordCategory
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "5f5f5f5f5f5f5f5f5f5f5f5f"
 *                     name:
 *                       type: string
 *                       example: "meme"
 *                     isRecommend:
 *                       type: boolean
 *                       example: false
 *                     isDeleted:
 *                       type: boolean
 *                       example: false
 *                     createdAt:
 *                       type: string
 *                       example: "2020-09-09T08:48:31.000Z"
 *                     updatedAt:
 *                       type: string
 *                       example: "2020-09-09T08:48:31.000Z"
 *       400:
 *         description: field should be provided or Cannot find KeywordCategory
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
 *                   example: field should be provided
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
 *   delete:
 *     tags: [KeywordCategory]
 *     summary: 키워드 카테고리 삭제
 *     description: 키워드 카테고리를 삭제합니다
 *     parameters:
 *       - in: path
 *         name: categoryName
 *         required: true
 *         schema:
 *           type: string
 *         description: 키워드 카테고리
 *     responses:
 *       200:
 *         description: 키워드 카테고리 삭제 성공
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
 *                   example: Deleted KeywordCategory
 *                 data:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Cannot find KeywordCategory
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
 *                   example: Cannot find KeywordCategory
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
router.get('/:categoryName', getRequestedKeywordCategoryInfo, getKeywordCategory);
router.put('/:categoryName', getRequestedKeywordCategoryInfo, updateKeywordCategory);
router.delete('/:categoryName', getRequestedKeywordCategoryInfo, deleteKeywordCategory);

export default router;
