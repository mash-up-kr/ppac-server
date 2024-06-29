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
import { keywordDuplicateValid } from '../middleware/duplicateValid';

const router = express.Router();

router.use(loggerMiddleware);

router.post('/', keywordDuplicateValid, createKeyword);
router.put('/:keywordId', getKeywordInfoById, updateKeyword);
router.delete('/:keywordId', getKeywordInfoById, deleteKeyword);

router.get('/top', getTopKeywords);
router.post('/increaseSearchCount', getKeywordInfoByName, increaseSearchCount);

export default router;
