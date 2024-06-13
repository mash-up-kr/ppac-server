import express from 'express';

import {
  deleteMeme,
  getMeme,
  updateMeme,
  createMeme,
  getTodayMemeList,
} from '../controller/meme.controller';
import { getRequestedMemeInfo } from '../middleware/requestedInfo';

const router = express.Router();

router.post('/', createMeme); // meme 생성
router.get('/:memeId', getMeme); // meme 조회
router.patch('/:memeId', getRequestedMemeInfo, updateMeme); // meme 수정
router.delete('/:memeId', getRequestedMemeInfo, deleteMeme); // meme 삭제

router.get('/todayMeme', getTodayMemeList); // 오늘의 추천 밈 (5개)

export default router;
