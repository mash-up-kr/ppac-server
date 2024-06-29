import express from 'express';

import {
  deleteMeme,
  getMemeWithKeywords,
  updateMeme,
  createMeme,
  getTodayMemeList,
  getAllMemeList,
  searchMemeByKeyword,
  createMemeShare,
  createMemeSave,
  createMemeReaction,
  createMemeWatch,
} from '../controller/meme.controller';
import {
  getRequestedMemeInfo,
  getKeywordInfoByName,
  getRequestedUserInfo,
} from '../middleware/requestedInfo';

const router = express.Router();

router.get('/list', getAllMemeList); // meme 목록 전체 조회
router.get('/todayMeme', getTodayMemeList); // 오늘의 추천 밈 (5개)

router.post('/', createMeme); // meme 생성
router.get('/:memeId', getMemeWithKeywords); // meme 조회
router.patch('/:memeId', getRequestedMemeInfo, updateMeme); // meme 수정
router.delete('/:memeId', getRequestedMemeInfo, deleteMeme); // meme 삭제

// meme 상호작용
router.post('/:memeId/save', getRequestedMemeInfo, getRequestedUserInfo, createMemeSave);
router.post('/:memeId/share', getRequestedMemeInfo, getRequestedUserInfo, createMemeShare);
router.post('/:memeId/watch', getRequestedMemeInfo, getRequestedUserInfo, createMemeWatch);
router.post('/:memeId/reaction', getRequestedMemeInfo, getRequestedUserInfo, createMemeReaction);

router.get('/search/:name', getKeywordInfoByName, searchMemeByKeyword);

export default router;
