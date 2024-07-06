import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';

import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';
import { CustomRequest } from '../middleware/requestedInfo';
import { InteractionType, MemeInteractionModel } from '../model/memeInteraction';
import * as UserService from '../service/user.service';
import { createSuccessResponse } from '../util/response';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  if (!_.has(req.body, 'deviceId')) {
    return next(new CustomError(`'deviceId' field should be provided`, HttpCode.BAD_REQUEST));
  }

  try {
    const user = await UserService.createUser(req.body.deviceId);
    const level = getLevel(user.watch, user.reaction, user.share);
    return res.json(createSuccessResponse(HttpCode.CREATED, 'Create User', { ...user, level }));
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

    const level = getLevel(watch, reaction, share);

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

const getLastSeenMemes = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.requestedUser;

  try {
    const memeList = await UserService.getLastSeenMemes(user);
    return res.json(createSuccessResponse(HttpCode.OK, 'Get Last Seen Meme', memeList));
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

const getSavedMemes = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.requestedUser;

  const page = parseInt(req.query.page as string) || 1;
  if (page < 1) {
    return next(new CustomError(`Invalid 'page' parameter`, HttpCode.BAD_REQUEST));
  }

  const size = parseInt(req.query.size as string) || 10;
  if (size < 1) {
    return next(new CustomError(`Invalid 'size' parameter`, HttpCode.BAD_REQUEST));
  }

  try {
    const memeList = await UserService.getSavedMemes(page, size, user);

    const data = {
      pagination: {
        total: memeList.total,
        page: memeList.page,
        perPage: size,
        currentPage: memeList.page,
        totalPages: memeList.totalPages,
      },
      memeList: memeList.data,
    };
    return res.json(createSuccessResponse(HttpCode.OK, 'Get saved Meme List', data));
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

export { getUser, createUser, getLastSeenMemes, getSavedMemes };

function getLevel(watch: number, reaction: number, share: number): number {
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
