import express from 'express';

import {
  createKeywordCategory,
  getKeywordCategory,
  updateKeywordCategory,
  deleteKeywordCategory,
} from '../controller/keywordCategory.controller';
import { validateCategoryDuplication } from '../middleware/duplicateValidator';
import { getRequestedKeywordCategoryInfo } from '../middleware/requestedInfo';

const router = express.Router();

router.post('/', validateCategoryDuplication, createKeywordCategory);
router.get('/:categoryName', getRequestedKeywordCategoryInfo, getKeywordCategory);
router.put('/:categoryName', getRequestedKeywordCategoryInfo, updateKeywordCategory);
router.delete('/:categoryName', getRequestedKeywordCategoryInfo, deleteKeywordCategory);

export default router;
