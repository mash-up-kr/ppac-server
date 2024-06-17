import express from 'express';
import * as UserController from '../controller/user.controller';

const router = express.Router();

router.post('/',UserController.createUser); // user 생성
router.put('/lastSeenMeme',UserController.updateLastSeenMeme); // user가 본 meme 업데이트


router.post('/reaction',UserController.createMemeReaction); // user의 reaction 생성
router.post('/save',UserController.createMemeSave); // user의 save 생성
router.post('/share',UserController.createMemeShare); // user의 share 생성


router.delete('/reaction',UserController.deleteMemeReaction); // user의 reaction 삭제
router.delete('/save',UserController.deleteMemeSave); // user의 save 삭제

router.get('/:userId/lastSeenMeme', UserController.getLastSeenMeme); // user가 본 meme 조회
router.get('/:userId/save', UserController.getSavedMeme); // user가 저장한 meme 조회

export default router;
