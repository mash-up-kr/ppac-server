import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';

import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';
import * as KeywordCategoryService from '../service/keywordCategory.service';
import { logger } from '../util/logger';
import {
  IKeywordCategoryCreatePayload,
  IKeywordCategoryUpdatePayload,
} from '../model/keywordCategory';
import mongoose from 'mongoose';
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
      category._id as string,
      updateInfo,
    );
    logger.info(`Updated category with ID ${req.params.categoryId}`);
    return res.json({ success: true, updatedCategory });
  } catch (err) {
    return next(new CustomError(err.message, err.status || HttpCode.INTERNAL_SERVER_ERROR));
  }
};

const deleteKeywordCategory = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const category = req.requestedKeywordCategory;
  try {
    const deletedKeyword = await KeywordCategoryService.deleteKeywordCategory(
      category._id as string,
    );
    return res.json({ success: true, deletedKeyword });
  } catch (err) {
    return next(new CustomError(err.message, err.status || HttpCode.INTERNAL_SERVER_ERROR));
  }
};

const getKeywordCategory = async (req: Request, res: Response, next: NextFunction) => {
  const categoryId = req.params?.categoryId || null;

  if (_.isNull(categoryId)) {
    return next(new CustomError(`'categoryId' field should be provided`, HttpCode.BAD_REQUEST));
  }

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return next(new CustomError(`'categoryId' is not a valid ObjectId`, HttpCode.BAD_REQUEST));
  }

  try {
    const keywordCategory = await KeywordCategoryService.getKeywordCategory(categoryId);
    if (_.isNull(keywordCategory)) {
      return next(new CustomError(`category(${categoryId}) not found.`, HttpCode.NOT_FOUND));
    }

    logger.info(`Get keywordCategory - ${keywordCategory})`);
    return res.json({ ...keywordCategory });
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

export { createKeywordCategory, updateKeywordCategory, deleteKeywordCategory, getKeywordCategory };
