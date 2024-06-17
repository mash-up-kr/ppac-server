import express from 'express';

import meme from './meme';
import user from './user';
import keyword from './keyword';
import { errorHandler } from '../middleware/errorHandler';
import { loggerMiddleware } from '../util/logger';

const router = express.Router();

router.use(loggerMiddleware);

router.use('/api/meme', meme);
router.use('/api/user', user);
router.use('/api/keyword', keyword);

router.use(errorHandler);

export default router;
