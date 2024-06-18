import express from 'express';
import {
  createKeyword,
  getTopKeywords,
  incrementSearchCount,
} from '../controller/keyword.controller';
import { loggerMiddleware } from '../util/logger';

const router = express.Router();

router.use(loggerMiddleware);

router.post('/', createKeyword);
router.get('/top', getTopKeywords);
router.post('/:keywordId/increment', incrementSearchCount);

export default router;
