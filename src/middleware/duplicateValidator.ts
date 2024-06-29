import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';

import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';
import { KeywordModel } from '../model/keyword';
import { KeywordCategoryModel } from '../model/keywordCategory';

export const validateCategoryDuplication = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name } = req.body;

  if (!_.has(req.body, 'name')) {
    return next(new CustomError(`'name' field should be provided`, HttpCode.BAD_REQUEST));
  }
  const category = await KeywordCategoryModel.findOne({ name, isDeleted: false }).lean();

  if (category) {
    return next(new CustomError('category already exists', HttpCode.BAD_REQUEST));
  }

  next();
};

export const validateCategory = async (req: Request, res: Response, next: NextFunction) => {
  const { category } = req.body;

  if (!_.has(req.body, 'category')) {
    return next(new CustomError(`'category' field should be provided`, HttpCode.BAD_REQUEST));
  }

  const keywordCategory = await KeywordCategoryModel.findOne({
    name: category,
    isDeleted: false,
  }).lean();

  if (_.isNull(keywordCategory)) {
    return next(new CustomError('category does not exists', HttpCode.NOT_FOUND));
  }

  next();
};

export const validateKeywordDulication = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name } = req.body;

  if (!_.has(req.body, 'name')) {
    return next(new CustomError(`'name' field should be provided`, HttpCode.BAD_REQUEST));
  }

  const keyword = await KeywordModel.findOne({ name, isDeleted: false }).lean();
  if (keyword) {
    return next(new CustomError('keyword already exists', HttpCode.BAD_REQUEST));
  }

  next();
};
