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
import { loggerMiddleware } from '../util/logger';

const router = express.Router();

router.use(loggerMiddleware);

router.post('/', validateCategory, validateKeywordDulication, createKeyword);
router.put('/:keywordId', getKeywordInfoById, updateKeyword);
router.delete('/:keywordId', getKeywordInfoById, deleteKeyword);

router.get('/top', getTopKeywords); // 인기 키워드 조회
router.patch('/count', getKeywordInfoByName, increaseSearchCount); // 키워드 조회수 업데이트

router.get('/recommend', getRecommendedKeywords);
export default router;
