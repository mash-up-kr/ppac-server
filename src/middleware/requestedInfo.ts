import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';
import mongoose from 'mongoose';

import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';
import { IMemeDocument } from '../model/meme';
import { getMeme } from '../service/meme.service';

export interface CustomMemeRequest extends Request {
  requestedMeme?: IMemeDocument;
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
