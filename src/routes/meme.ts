import express from 'express';

import {
  deleteMeme,
  getMeme,
  updateMeme,
  createMeme,
  getTodayMemeList,
  getAllMemeList,
} from '../controller/meme.controller';
import { getRequestedMemeInfo } from '../middleware/requestedInfo';
import { getMemeWithKeywords } from '../service/meme.service';

const router = express.Router();

router.get('/list', getAllMemeList); // meme 목록 전체 조회
router.get('/todayMeme', getTodayMemeList); // 오늘의 추천 밈 (5개)

router.post('/', createMeme); // meme 생성
router.get('/:memeId', getMemeWithKeywords); // meme 조회
router.patch('/:memeId', getRequestedMemeInfo, updateMeme); // meme 수정
router.delete('/:memeId', getRequestedMemeInfo, deleteMeme); // meme 삭제

export default router;
