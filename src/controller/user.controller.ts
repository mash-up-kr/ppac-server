import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';
import { CustomRequest } from 'src/middleware/requestedInfo';

import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';
import * as UserService from '../service/user.service';
import { createSuccessResponse } from '../util/response';

enum MemeWatchType {
  SEARCH = 'search',
  RECOMMEND = 'recommend',
}

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  if (!_.has(req.body, 'deviceId')) {
    return next(new CustomError(`'deviceId' field should be provided`, HttpCode.BAD_REQUEST));
  }

  try {
    const user = await UserService.createUser(req.body);
    return res.json(createSuccessResponse(HttpCode.CREATED, 'Create User', user));
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

const createMemeReaction = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.requestedUser;
  const meme = req.requestedMeme;

  try {
    const updatedMeme = await UserService.createMemeReaction(user, meme);
    return res.json(createSuccessResponse(HttpCode.CREATED, 'Create Meme Reaction', updatedMeme));
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

const createMemeSave = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.requestedUser;
  const meme = req.requestedMeme;

  try {
    const updatedMeme = await UserService.createMemeSave(user, meme);
    return res.json(createSuccessResponse(HttpCode.CREATED, 'Crate Meme Save', updatedMeme));
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

const createMemeShare = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.requestedUser;
  const meme = req.requestedMeme;

  try {
    const updatedMeme = await UserService.createMemeShare(user, meme);
    return res.json(createSuccessResponse(HttpCode.CREATED, 'Crate Meme Share', updatedMeme));
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

const createMemeWatch = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.requestedUser;
  const meme = req.requestedMeme;
  const type = req.params.type as MemeWatchType;
  try {
    let updatedMeme;
    switch (type) {
      // todo
      case MemeWatchType.SEARCH:
        [updatedMeme] = await Promise.all([
          UserService.createMemeWatch(user, meme),
          UserService.updateLastSeenMeme(user, meme),
        ]);
        break;
      case MemeWatchType.RECOMMEND:
        updatedMeme = await UserService.createRecommendWatch(user, meme);
        break;

      default:
        throw new CustomError('Invalid type parameter', 400);
    }

    return res.json(createSuccessResponse(HttpCode.CREATED, `${type} Meme Watch`, updatedMeme));
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

const deleteMemeSave = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.requestedUser;
  const meme = req.requestedMeme;

  try {
    const updatedMeme = await UserService.deleteMemeSave(user, meme);
    return res.json(createSuccessResponse(HttpCode.OK, 'Delete Meme Save', updatedMeme));
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

const getLastSeenMeme = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.requestedUser;

  try {
    const memeList = await UserService.getLastSeenMeme(user);
    return res.json(createSuccessResponse(HttpCode.OK, 'Get Last Seen Meme', memeList));
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

const getSavedMeme = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.requestedUser;

  try {
    const memeList = await UserService.getSavedMeme(user);
    return res.json(createSuccessResponse(HttpCode.OK, 'Get saved Meme List', memeList));
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

export {
  createUser,
  createMemeReaction,
  createMemeSave,
  createMemeShare,
  createMemeWatch,
  deleteMemeSave,
  getLastSeenMeme,
  getSavedMeme,
};
