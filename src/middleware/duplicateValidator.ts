import { NextFunction, Request, Response } from 'express';

import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';
import { KeywordModel } from '../model/keyword';
import { KeywordCategoryModel } from '../model/keywordCategory';

export const validateCategoryDuplication = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;

  if (!name) {
    return next(new CustomError('name is required', HttpCode.BAD_REQUEST));
  }
  const category = KeywordCategoryModel.findOne({ name, isDeleted: false }).lean();

  if (category) {
    return next(new CustomError('category already exists', HttpCode.BAD_REQUEST));
  }

  next();
};

export const validateKeywordDulication = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;

  if (!name) {
    return next(new CustomError('name is required', HttpCode.BAD_REQUEST));
  }

  const keyword = KeywordModel.findOne({ name, isDeleted: false }).lean();
  if (keyword) {
    return next(new CustomError('keyword already exists', HttpCode.BAD_REQUEST));
  }
  next();
};
