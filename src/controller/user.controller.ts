import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';
import * as UserService from '../service/user.service';
import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';
import { CustomRequest } from 'src/middleware/requestedInfo';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  if (!_.has(req.body, 'deviceId')) {
    return next(new CustomError(`'deviceId' field should be provided`, HttpCode.BAD_REQUEST));
  }

  try {
    const user = await UserService.createUser(req.body);
    return res.json({ ...user });
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

const updateLastSeenMeme = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.requestedUser;
  const meme = req.requestedMeme;

  try {
    const updatedUser = await UserService.updateLastSeenMeme(user.deviceId, meme._id as string);
    return res.json({ ...updatedUser });
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

const createMemeReaction = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.requestedUser;
  const meme = req.requestedMeme;

  try {
    const updatedMeme = await UserService.createMemeReaction(user.deviceId, meme._id as string);
    return res.json({ ...updatedMeme });
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

const createMemeSave = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.requestedUser;
  const meme = req.requestedMeme;

  try {
    const ret = await UserService.createMemeSave(user.deviceId, meme._id as string);
    return res.json({ ret });
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

const createMemeShare = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.requestedUser;
  const meme = req.requestedMeme;

  try {
    const ret = await UserService.createMemeShare(user.deviceId, meme._id as string);
    return res.json({ ret });
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

const deleteMemeReaction = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.requestedUser;
  const meme = req.requestedMeme;

  try {
    const ret = await UserService.deleteMemeReaction(user.deviceId, meme._id as string);
    return res.json({ ret });
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

const deleteMemeSave = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.requestedUser;
  const meme = req.requestedMeme;

  try {
    const result = await UserService.deleteMemeSave(user.deviceId, meme._id as string);
    return res.json({ result });
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

const getLastSeenMeme = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.requestedUser;

  try {
    const memeList = await UserService.getLastSeenMeme(user.deviceId);
    return res.json({ memeList });
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

const getSavedMeme = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.requestedUser;

  try {
    const memeList = await UserService.getSavedMeme(user.deviceId);
    return res.json({ memeList });
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

export {
  createUser,
  updateLastSeenMeme,
  createMemeReaction,
  createMemeSave,
  createMemeShare,
  deleteMemeReaction,
  deleteMemeSave,
  getLastSeenMeme,
  getSavedMeme,
};
