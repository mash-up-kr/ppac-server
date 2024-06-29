import { NextFunction, Request, Response } from 'express';
import { KeywordModel } from '../model/keyword';
import { KeywordCategoryModel } from '../model/keywordCategory';

export const categoryDuplicateValid = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;

  if (!name) {
    return next(new Error('name is required'));
  }
  const category = KeywordCategoryModel.findOne({ name }).lean();
  if (category) {
    return next(new Error('category already exists'));
  }
  next();
};

export const keywordDuplicateValid = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;

  if (!name) {
    return next(new Error('name is required'));
  }
  const keyword = KeywordModel.findOne({ name }).lean();
  if (keyword) {
    return next(new Error('keyword already exists'));
  }
  next();
};
