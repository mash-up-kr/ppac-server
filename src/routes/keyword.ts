import express from 'express';
import {
  createKeyword,
  getTopKeywords,
  deleteKeyword,
  updateKeyword,
} from '../controller/keyword.controller';
import { loggerMiddleware } from '../util/logger';

const router = express.Router();

router.use(loggerMiddleware);

router.post('/', createKeyword);
router.put('/:keywordId', updateKeyword);
router.delete('/:keywordId', deleteKeyword);

router.get('/top', getTopKeywords);

export default router;
