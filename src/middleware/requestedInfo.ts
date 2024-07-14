import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';
import mongoose from 'mongoose';

import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';
import { IKeywordDocument } from '../model/keyword';
import { IKeywordCategoryDocument } from '../model/keywordCategory';
import { IMemeDocument } from '../model/meme';
import { IUserDocument } from '../model/user';
import { getKeywordByName, getKeywordById } from '../service/keyword.service';
import { getKeywordCategory } from '../service/keywordCategory.service';
import { getMeme } from '../service/meme.service';
import { getUser } from '../service/user.service';

export interface CustomRequest extends Request {
  requestedMeme?: IMemeDocument;
  requestedUser?: IUserDocument;
  requestedKeyword?: IKeywordDocument;
  requestedKeywordCategory?: IKeywordCategoryDocument;
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

  const meme: IMemeDocument = await getMeme(memeId);
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
  if (_.isNull(keyword)) {
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
  const deviceId = req.headers['x-device-id'] as string;

  if (!deviceId) {
    return next(new CustomError(`'x-device-id' header should be provided`, HttpCode.BAD_REQUEST));
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
  const categoryName = req.params?.categoryName || req.body?.categoryName || null;

  if (_.isNull(categoryName)) {
    return next(new CustomError(`'categoryName' should be provided`, HttpCode.BAD_REQUEST));
  }

  try {
    const keywordCategory: IKeywordCategoryDocument = await getKeywordCategory(categoryName);

    req.requestedKeywordCategory = keywordCategory;
    next();
  } catch (err) {
    return next(new CustomError(err.message, err.status || HttpCode.INTERNAL_SERVER_ERROR));
  }
};
