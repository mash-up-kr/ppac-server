import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';
import * as UserService from '../service/user.service';
import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  if (!_.has(req.body, 'deviceID')) {
    return next(new CustomError(`'keywords' field should be provided`, HttpCode.BAD_REQUEST));
  }

  try {
    const user = await UserService.createUser(req.body);
    return res.json({ ...user });
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

const updateLastSeenMeme = async (req: Request, res: Response, next: NextFunction) => {
  if (!_.has(req.body, 'deviceID')) {
    return next(new CustomError(`'deviceID' field should be provided`, HttpCode.BAD_REQUEST));
  }

  if (!_.has(req.body, 'memeID')) {
    return next(new CustomError(`'memeID' field should be provided`, HttpCode.BAD_REQUEST));
  }

  try {
    const user = await UserService.updateLastSeenMeme(req.body.deviceID, req.body.memeID);
    return res.json({ ...user });
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
}

const createMemeReaction = async (req: Request, res: Response, next: NextFunction) => {
  if (!_.has(req.body, 'deviceID')) {
    return next(new CustomError(`'deviceID' field should be provided`, HttpCode.BAD_REQUEST));
  }

  if (!_.has(req.body, 'memeID')) {
    return next(new CustomError(`'memeID' field should be provided`, HttpCode.BAD_REQUEST));
  }

  try {
    const meme = await UserService.createMemeReaction(req.body.deviceID, req.body.memeID);
    return res.json({ ...meme });
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
}

const createMemeSave = async (req: Request, res: Response, next: NextFunction) => {
  if (!_.has(req.body, 'deviceID')) {
    return next(new CustomError(`'deviceID' field should be provided`, HttpCode.BAD_REQUEST));
  }

  if (!_.has(req.body, 'memeID')) {
    return next(new CustomError(`'memeID' field should be provided`, HttpCode.BAD_REQUEST));
  }

  try {
    const meme = await UserService.createMemeSave(req.body.deviceID, req.body.memeID);
    return res.json({ ...meme });
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
}

const createMemeShare = async (req: Request, res: Response, next: NextFunction) => {
  if (!_.has(req.body, 'deviceID')) {
    return next(new CustomError(`'deviceID' field should be provided`, HttpCode.BAD_REQUEST));
  }

  if (!_.has(req.body, 'memeID')) {
    return next(new CustomError(`'memeID' field should be provided`, HttpCode.BAD_REQUEST));
  }

  try {
    const meme = await UserService.createMemeShare(req.body.deviceID, req.body.memeID);
    return res.json({ ...meme });
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
}

const deleteMemeReaction = async (req: Request, res: Response, next: NextFunction) => {
  if (!_.has(req.body, 'deviceID')) {
    return next(new CustomError(`'deviceID' field should be provided`, HttpCode.BAD_REQUEST));
  }

  if (!_.has(req.body, 'memeID')) {
    return next(new CustomError(`'memeID' field should be provided`, HttpCode.BAD_REQUEST));
  }

  try {
    const meme = await UserService.deleteMemeReaction(req.body.deviceID, req.body.memeID);
    return res.json({ ...meme });
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
}

const deleteMemeSave = async (req: Request, res: Response, next: NextFunction) => {
  if (!_.has(req.body, 'deviceID')) {
    return next(new CustomError(`'deviceID' field should be provided`, HttpCode.BAD_REQUEST));
  }

  if (!_.has(req.body, 'memeID')) {
    return next(new CustomError(`'memeID' field should be provided`, HttpCode.BAD_REQUEST));
  }

  try {
    const result = await UserService.deleteMemeSave(req.body.deviceID, req.body.memeID);
    return res.json({ result });
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
}

const getLastSeenMeme = async (req: Request, res: Response, next: NextFunction) => {
  if (!_.has(req.params, 'deviceID')) {
    return next(new CustomError(`'deviceID' field should be provided`, HttpCode.BAD_REQUEST));
  }

  try {
    const memeList = await UserService.getLastSeenMeme(req.params.deviceID);
    return res.json({ memeList });
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
}

const getSavedMeme = async (req: Request, res: Response, next: NextFunction) => {
  if (!_.has(req.params, 'deviceID')) {
    return next(new CustomError(`'deviceID' field should be provided`, HttpCode.BAD_REQUEST));
  }

  try {
    const memeList = await UserService.getSavedMeme(req.params.deviceID);
    return res.json({ memeList });
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
}

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


