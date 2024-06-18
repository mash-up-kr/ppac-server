import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';
import mongoose from 'mongoose';

import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';
import { IMemeDocument } from '../model/meme';
import { getMeme } from '../service/meme.service';
import { getUser } from '../service/user.service';
import { IUserDocument } from '../model/user';

export interface CustomRequest extends Request {
  requestedMeme?: IMemeDocument;
  requestedUser?: IUserDocument;
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
