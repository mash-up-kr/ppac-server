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
 *       201:
 *         description: 키워드 카테고리를 만들어진다.
 *       400:
 *         description: 키워드 카테고리를 만들어진다.
 */
router.post('/', validateCategoryDuplication, createKeywordCategory);

/**
 * @swagger
 * /api/keywordCategory/{categoryName}:
 *   get:
 *     tags: [KeywordCategory]
 *     summary: 키워드 카테고리
 *     description: 키워드 카테고리를 반환합니다
 *     responses:
 *       200:
 *         description: 키워드 카테고리
 *       500:
 *         description: 키워드 카테고리
 *   parameters:
 *     - in: path
 *       name: categoryName
 *       required: true
 *       schema:
 *         type: string
 *       description: 키워드 카테고리
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
 *       400:
 *         description: 키워드 카테고리를 만들어진다.
 *       404:
 *         description: 키워드 카테고리를 만들어진다.
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
 *         description: 키워드 카테고리를 삭제해야다.
 *       400:
 *         description: 키워드 카테고리를 만들어진다.
 *       404:
 *         description: 키워드 카테고리를 만들어진다.
 *       501:
 *         description: 키워드 카테고리를 삭제해야다.
 *       500:
 *         description: 키워드 카테고리를 삭제해야다.
 */
router.get('/:categoryName', getRequestedKeywordCategoryInfo, getKeywordCategory);
router.put('/:categoryName', getRequestedKeywordCategoryInfo, updateKeywordCategory);
router.delete('/:categoryName', getRequestedKeywordCategoryInfo, deleteKeywordCategory);

export default router;
