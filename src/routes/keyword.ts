import express from 'express';

import {
  createKeyword,
  getTopKeywords,
  deleteKeyword,
  updateKeyword,
  increaseSearchCount,
} from '../controller/keyword.controller';
import { getKeywordInfoByName, getKeywordInfoById } from '../middleware/requestedInfo';
import { loggerMiddleware } from '../util/logger';

const router = express.Router();

router.use(loggerMiddleware);

router.post('/', createKeyword); // 키워드 생성
router.put('/:keywordId', getKeywordInfoById, updateKeyword); // 키워드 수정
router.delete('/:keywordId', getKeywordInfoById, deleteKeyword); // 키워드 삭제

router.get('/top', getTopKeywords); // 인기 키워드 조회
router.patch('/count', getKeywordInfoByName, increaseSearchCount); // 키워드 조회수 업데이트

export default router;
