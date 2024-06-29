import express from 'express';

import keyword from './keyword';
import meme from './meme';
import user from './user';
import { errorHandler } from '../middleware/errorHandler';

const router = express.Router();

router.use('/api/meme', meme);
router.use('/api/user', user);
router.use('/api/keyword', keyword);

router.use(errorHandler);

export default router;
