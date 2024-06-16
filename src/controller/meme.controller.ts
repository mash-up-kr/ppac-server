import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';

import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';
import { CustomMemeRequest } from '../middleware/requestedInfo';
import { IMeme, IMemeCreatePayload } from '../model/meme';
import * as MemeService from '../service/meme.service';
import { logger } from '../util/logger';

const getMeme = async (req: Request, res: Response, next: NextFunction) => {
  const memeId = req.params?.memeId || req.body?.memeId || null;

  const meme = await MemeService.getMeme(memeId);
  logger.info(`Get meme - ${memeId})`);
  return res.json({ ...meme });
};

const createMeme = async (req: Request, res: Response, next: NextFunction) => {
  if (!_.has(req.body, 'keywords')) {
    return next(new CustomError(`'keywords' field should be provided`, HttpCode.BAD_REQUEST));
  }

  if (!_.has(req.body, 'image')) {
    return next(new CustomError(`'image' field should be provided`, HttpCode.BAD_REQUEST));
  }

  if (!_.has(req.body, 'source')) {
    return next(new CustomError(`'source' field should be provided`, HttpCode.BAD_REQUEST));
  }

  try {
    const meme = await MemeService.createMeme(req.body);
    return res.json({ ...meme });
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

const updateMeme = async (req: CustomMemeRequest, res: Response, next: NextFunction) => {
  const meme = req.requestedMeme;
  const updateInfo: IMemeCreatePayload = req.body;

  try {
    const updatedMeme = await MemeService.updateMeme(meme._id, updateInfo);
    return res.json({ ...updatedMeme });
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

const deleteMeme = async (req: CustomMemeRequest, res: Response, next: NextFunction) => {
  const meme = req.requestedMeme;
  try {
    const deletedMeme = await MemeService.deleteMeme(meme._id);
    return res.json({ result: deletedMeme });
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

const getAllMemeList = async (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req?.params.page) || 1;
  const size = parseInt(req?.params.size) || 10;

  try {
    const memeList = await MemeService.getAllMemeList(page, size);
    return res.json(memeList);
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

const getTodayMemeList = async (req: Request, res: Response, next: NextFunction) => {
  const size = parseInt(req.query.size as string) || 5;

  if (size > 5) {
    return next(
      new CustomError(`Invalid 'size' parameter. Today Meme max size is 5.`, HttpCode.BAD_REQUEST),
    );
  }

  try {
    const todayMemeList = await MemeService.getTodayMemeList(size);
    return res.json({ data: todayMemeList });
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

export { getMeme, getTodayMemeList, getAllMemeList, createMeme, deleteMeme, updateMeme };
