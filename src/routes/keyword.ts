import express from 'express';
import { getTopKeywords } from '../controller/keyword.controller';
import { loggerMiddleware } from '../util/logger';

const router = express.Router();

router.use(loggerMiddleware);

router.get('/top', getTopKeywords);

export default router;
