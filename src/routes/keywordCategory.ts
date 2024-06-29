import express from 'express';
import {
  createKeywordCategory,
  getKeywordCategory,
  updateKeywordCategory,
  deleteKeywordCategory,
} from '../controller/keywordCategory.controller';
import { getRequestedKeywordCategoryInfo } from '../middleware/requestedInfo';
import { categoryDuplicateValid } from '../middleware/duplicateValid';

const router = express.Router();

router.post('/', categoryDuplicateValid, createKeywordCategory);
router.get('/:categoryName', getRequestedKeywordCategoryInfo, getKeywordCategory);
router.put('/:categoryName', getRequestedKeywordCategoryInfo, updateKeywordCategory);
router.delete('/:categoryName', getRequestedKeywordCategoryInfo, deleteKeywordCategory);

export default router;
