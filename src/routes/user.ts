import express from 'express';

import * as UserController from '../controller/user.controller';
import { getRequestedMemeInfo, getRequestedUserInfo } from '../middleware/requestedInfo';

const router = express.Router();

router.post('/', UserController.createUser); // user 생성

router.get('/:userId', getRequestedUserInfo, UserController.getUser); // user 조회

router.post(
  '/reaction',
  getRequestedMemeInfo,
  getRequestedUserInfo,
  UserController.createMemeReaction,
); // user의 reaction 생성
router.post('/save', getRequestedMemeInfo, getRequestedUserInfo, UserController.createMemeSave); // user의 save 생성
router.delete('/save', getRequestedMemeInfo, getRequestedUserInfo, UserController.deleteMemeSave); // user의 save 삭제

router.post('/share', getRequestedMemeInfo, getRequestedUserInfo, UserController.createMemeShare); // user의 share 생성
router.post('/watch', getRequestedMemeInfo, getRequestedUserInfo, UserController.createMemeWatch); // user의 watch 생성

router.get('/:userId/save', getRequestedUserInfo, UserController.getSavedMeme); // user가 저장한 meme 조회

export default router;
