import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';

import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';
import { CustomRequest } from '../middleware/requestedInfo';
import { IKeywordCategoryUpdatePayload } from '../model/keywordCategory';
import * as KeywordCategoryService from '../service/keywordCategory.service';
import { logger } from '../util/logger';
import { createSuccessResponse } from '../util/response';

const createKeywordCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newCategory = await KeywordCategoryService.createKeywordCategory(req.body);
    logger.info(`category created: ${JSON.stringify(newCategory)}`);
    return res.json(
      createSuccessResponse(HttpCode.CREATED, 'Created KeywordCategory', newCategory),
    );
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
    return res.json(createSuccessResponse(HttpCode.OK, 'Update KeywordCategor', updatedCategory));
  } catch (err) {
    return next(new CustomError(err.message, err.status || HttpCode.INTERNAL_SERVER_ERROR));
  }
};

const deleteKeywordCategory = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const category = req.requestedKeywordCategory;
  try {
    await KeywordCategoryService.deleteKeywordCategory(category.name);
    return res.json(createSuccessResponse(HttpCode.OK, 'Deleted KeywordCategor', true));
  } catch (err) {
    return next(new CustomError(err.message, err.status || HttpCode.INTERNAL_SERVER_ERROR));
  }
};

const getKeywordCategory = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const category = req.requestedKeywordCategory;

  return res.json(createSuccessResponse(HttpCode.OK, 'Get Keyword Category', category));
};

export { createKeywordCategory, updateKeywordCategory, deleteKeywordCategory, getKeywordCategory };
