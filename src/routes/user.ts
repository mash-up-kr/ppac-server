import express from 'express';

const router = express.Router();

router.post('/'); // user 생성
router.get('/:userId'); // user 조회

router.get('/:userId/save'); // user가 저장한 meme 조회

export default router;
