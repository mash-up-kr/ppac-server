import express from 'express';
import { createKeyword, getTopKeywords, deleteKeyword } from '../controller/keyword.controller';
import { loggerMiddleware } from '../util/logger';

const router = express.Router();

router.use(loggerMiddleware);

router.post('/', createKeyword);
router.get('/top', getTopKeywords);
router.delete('/:keywordId', deleteKeyword);

export default router;
