import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';
import mongoose from 'mongoose';

import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';
import { IMemeDocument } from '../model/meme';
import { getMeme } from '../service/meme.service';
import { getKeywordByName, getKeywordById } from '../service/keyword.service';
import { getKeywordCategory } from '../service/keywordCategory.service';
import { IKeyword } from 'src/model/keyword';
import { getUser } from '../service/user.service';
import { IUserDocument } from '../model/user';
import { IKeywordCategory } from '../model/keywordCategory';

export interface CustomRequest extends Request {
  requestedMeme?: IMemeDocument;
  requestedUser?: IUserDocument;
  requestedKeyword?: IKeyword;
  requestedKeywordCategory?: IKeywordCategory;
}

export const getRequestedMemeInfo = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const memeId = req.params?.memeId || req.body?.memeId || null;

  if (_.isNull(memeId)) {
    return next(new CustomError(`'memeId' should be provided`, HttpCode.BAD_REQUEST));
  }

  if (!mongoose.Types.ObjectId.isValid(memeId)) {
    return next(new CustomError(`'memeId' is not a valid ObjectId`, HttpCode.BAD_REQUEST));
  }

  const meme = await getMeme(memeId);
  if (_.isNull(meme)) {
    return next(new CustomError(`Meme(${memeId}) does not exist`, HttpCode.NOT_FOUND));
  }

  req.requestedMeme = meme;
  next();
};

export const getKeywordInfoByName = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const keywordName = req.params?.name || req.body?.name || null;

  if (_.isNull(keywordName)) {
    return next(new CustomError(`'name' should be provided`, HttpCode.BAD_REQUEST));
  }

  const keyword = await getKeywordByName(keywordName);

  if (!keyword) {
    return next(
      new CustomError(`Keyword with name ${keywordName} does not exist`, HttpCode.NOT_FOUND),
    );
  }

  req.requestedKeyword = keyword;
  next();
};

export const getKeywordInfoById = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const keywordId = req.params?.keywordId || req.body?.keywordId || null;

  if (_.isNull(keywordId)) {
    return next(new CustomError(`'keywordId' should be provided`, HttpCode.BAD_REQUEST));
  }

  if (!mongoose.Types.ObjectId.isValid(keywordId)) {
    return next(new CustomError(`'keywordId' is not a valid ObjectId`, HttpCode.BAD_REQUEST));
  }

  const keyword = await getKeywordById(keywordId);
  if (_.isNull(keyword)) {
    return next(new CustomError(`Keyword(${keywordId}) does not exist`, HttpCode.NOT_FOUND));
  }

  req.requestedKeyword = keyword;
  next();
};

export const getRequestedUserInfo = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const deviceId = req.params?.deviceId || req.body?.deviceId || null;

  if (_.isNull(deviceId)) {
    return next(new CustomError(`'deviceId' should be provided`, HttpCode.BAD_REQUEST));
  }

  const user = await getUser(deviceId);

  if (_.isNull(user)) {
    return next(new CustomError(`user(${deviceId}) does not exist`, HttpCode.NOT_FOUND));
  }

  req.requestedUser = user;

  next();
};

export const getRequestedKeywordCategoryInfo = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const categoryId = req.params?.categoryId || req.body?.categoryId || null;

  if (_.isNull(categoryId)) {
    return next(new CustomError(`'categoryId' should be provided`, HttpCode.BAD_REQUEST));
  }
  const category = await getKeywordCategory(categoryId);
  if (_.isNull(category)) {
    return next(
      new CustomError(`KeywordCategory(${categoryId}) does not exist`, HttpCode.NOT_FOUND),
    );
  }
  req.requestedKeywordCategory = category;
  next();
};
