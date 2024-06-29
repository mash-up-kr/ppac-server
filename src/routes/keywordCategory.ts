import express from 'express';
import {
  createKeywordCategory,
  getKeywordCategory,
  updateKeywordCategory,
  deleteKeywordCategory,
} from '../controller/keywordCategory.controller';
import { getRequestedKeywordCategoryInfo } from '../middleware/requestedInfo';
import { categoryDuplicateValid } from 'src/middleware/duplicateValid';

const router = express.Router();

router.post('/', categoryDuplicateValid, createKeywordCategory);
router.get('/:categoryId', getRequestedKeywordCategoryInfo, getKeywordCategory);
router.put('/:categoryId', getRequestedKeywordCategoryInfo, updateKeywordCategory);
router.delete('/:categoryId', getRequestedKeywordCategoryInfo, deleteKeywordCategory);

export default router;
