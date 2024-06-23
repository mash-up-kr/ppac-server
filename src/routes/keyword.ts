import express from 'express';
import {
  createKeyword,
  getTopKeywords,
  deleteKeyword,
  updateKeyword,
  increaseSearchCount,
} from '../controller/keyword.controller';
import { getKeywordInfoByName } from '../middleware/requestedInfo';
import { loggerMiddleware } from '../util/logger';

const router = express.Router();

router.use(loggerMiddleware);

router.post('/', createKeyword);
router.put('/:keywordId', updateKeyword);
router.delete('/:keywordId', deleteKeyword);

router.get('/top', getTopKeywords);
router.post('/increaseSearchCount', getKeywordInfoByName, increaseSearchCount);

export default router;
