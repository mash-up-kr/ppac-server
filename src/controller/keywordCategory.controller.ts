import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';

import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';
import * as KeywordCategoryService from '../service/keywordCategory.service';
import { logger } from '../util/logger';
import { IKeywordCategoryUpdatePayload } from '../model/keywordCategory';
import { CustomRequest } from '../middleware/requestedInfo';

const createKeywordCategory = async (req: Request, res: Response, next: NextFunction) => {
  if (!_.has(req.body, 'name')) {
    return next(new CustomError(`'name' field should be provided`, HttpCode.BAD_REQUEST));
  }

  try {
    const newCategory = await KeywordCategoryService.createKeywordCategory(req.body);
    logger.info(`category created: ${JSON.stringify(newCategory)}`);
    return res.json(newCategory);
  } catch (err) {
    return next(new CustomError(err.message, err.status || HttpCode.INTERNAL_SERVER_ERROR));
  }
};

const updateKeywordCategory = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const category = req.requestedKeywordCategory;
  const updateInfo: IKeywordCategoryUpdatePayload = req.body;
  try {
    const updatedCategory = await KeywordCategoryService.updateKeywordCategory(
      category.name,
      updateInfo,
    );
    logger.info(`Updated category with ID ${req.params.categoryName}`);
    return res.json({ success: true, updatedCategory });
  } catch (err) {
    return next(new CustomError(err.message, err.status || HttpCode.INTERNAL_SERVER_ERROR));
  }
};

const deleteKeywordCategory = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const category = req.requestedKeywordCategory;
  try {
    const deletedKeyword = await KeywordCategoryService.deleteKeywordCategory(category.name);
    return res.json({ success: true, deletedKeyword });
  } catch (err) {
    return next(new CustomError(err.message, err.status || HttpCode.INTERNAL_SERVER_ERROR));
  }
};

const getKeywordCategory = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const category = req.requestedKeywordCategory;

  return res.json({ ...category });
};

export { createKeywordCategory, updateKeywordCategory, deleteKeywordCategory, getKeywordCategory };
