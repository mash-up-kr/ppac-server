import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';

import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';
import { IMeme } from '../model/meme';
import { getMeme } from '../service/meme.service';
import { getKeyword } from '../service/keyword.service';
import { IKeyword } from 'src/model/keyword';

export interface CustomMemeRequest extends Request {
  requestedMeme?: IMeme;
}

export const getRequestedMemeInfo = async (
  req: CustomMemeRequest,
  res: Response,
  next: NextFunction,
) => {
  const memeId = req.params?.memeId || req.body?.memeId || null;

  if (_.isNull(memeId)) {
    return next(new CustomError(`'memeId' should be provided`, HttpCode.BAD_REQUEST));
  }

  const meme = await getMeme(memeId);

  if (_.isNull(meme)) {
    return next(new CustomError(`Meme(${memeId}) does not exist`, HttpCode.NOT_FOUND));
  }

  req.requestedMeme = meme;
  next();
};

export interface CustomKeywordRequest extends Request {
  requestedKeyword?: IKeyword;
}

export const getKeywordInfoByName = async (
  req: CustomKeywordRequest,
  res: Response,
  next: NextFunction,
) => {
  const keywordName = req.params?.name || req.body?.name || null;

  if (_.isNull(keywordName)) {
    return next(new CustomError(`'name' should be provided`, HttpCode.BAD_REQUEST));
  }

  const keyword = await getKeyword(keywordName);

  if (!keyword) {
    return next(
      new CustomError(`Keyword with name ${keywordName} does not exist`, HttpCode.NOT_FOUND),
    );
  }

  req.requestedKeyword = keyword;
  next();
};
