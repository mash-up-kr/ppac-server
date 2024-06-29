import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';
import { CustomRequest } from '../middleware/requestedInfo';

import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';
import { InteractionType, MemeInteractionModel } from '../model/memeInteraction';
import * as UserService from '../service/user.service';
import { createSuccessResponse } from '../util/response';

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

const getUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.requestedUser;

  try {
    const countInteractionType = (type: InteractionType) =>
      MemeInteractionModel.countDocuments({
        deviceId: user.deviceId,
        interactionType: type,
      });

    const [watch, reaction, share, save] = await Promise.all([
      countInteractionType(InteractionType.WATCH),
      countInteractionType(InteractionType.REACTION),
      countInteractionType(InteractionType.SHARE),
      countInteractionType(InteractionType.SAVE),
    ]);

    const level = getLevel(watch, reaction, share, save);

    return res.json(
      createSuccessResponse(HttpCode.OK, 'Get User', {
        ...user,
        watch,
        reaction,
        share,
        save,
        level,
      }),
    );
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

export { getUser, createUser, getLastSeenMeme, getSavedMeme };

function getLevel(watch: number, reaction: number, share: number, save: number): number {
  let level = 1;
  if (watch >= 20 && reaction >= 20 && share >= 20) {
    level = 4;
  } else if (watch >= 20 && reaction >= 20) {
    level = 3;
  } else if (watch >= 20) {
    level = 2;
  }

  return level;
}
