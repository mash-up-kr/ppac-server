import express from 'express';

import * as UserController from '../controller/user.controller';
import { getRequestedUserInfo } from '../middleware/requestedInfo';

const router = express.Router();

router.post('/', UserController.createUser); // user 생성

router.get('/:deviceId', getRequestedUserInfo, UserController.getUser); // user 조회
router.get('/:deviceId/save', getRequestedUserInfo, UserController.getSavedMeme); // user가 저장한 meme 조회

export default router;
