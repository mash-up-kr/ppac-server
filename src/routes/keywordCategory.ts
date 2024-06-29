import express from 'express';
import {
  createKeywordCategory,
  getKeywordCategory,
  updateKeywordCategory,
  deleteKeywordCategory,
} from '../controller/keywordCategory.controller';
import { getRequestedKeywordCategoryInfo } from '../middleware/requestedInfo';

const router = express.Router();

router.post('/', createKeywordCategory);
router.get('/:categoryId', getKeywordCategory);
router.put('/:categoryId', getRequestedKeywordCategoryInfo, updateKeywordCategory);
router.delete('/:categoryId', getRequestedKeywordCategoryInfo, deleteKeywordCategory);

export default router;
