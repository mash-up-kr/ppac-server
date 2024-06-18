import express from 'express';
import { createKeyword, getTopKeywords } from '../controller/keyword.controller';
import { loggerMiddleware } from '../util/logger';

const router = express.Router();

router.use(loggerMiddleware);

router.post('/', createKeyword);
router.get('/top', getTopKeywords);

export default router;
