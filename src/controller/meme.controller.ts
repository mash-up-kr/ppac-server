import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import mongoose from 'mongoose';

import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';
import { CustomRequest } from '../middleware/requestedInfo';
import { IMemeCreatePayload, IMemeUpdatePayload } from '../model/meme';
import * as MemeService from '../service/meme.service';
import { logger } from '../util/logger';
import { createSuccessResponse } from '../util/response';

const getMeme = async (req: Request, res: Response, next: NextFunction) => {
  const memeId = req.params?.memeId || null;

  if (_.isNull(memeId)) {
    return next(new CustomError(`'memeId' field should be provided`, HttpCode.BAD_REQUEST));
  }

  if (!mongoose.Types.ObjectId.isValid(memeId)) {
    return next(new CustomError(`'memeId' is not a valid ObjectId`, HttpCode.BAD_REQUEST));
  }

  try {
    const meme = await MemeService.getMeme(memeId);
    if (_.isNull(meme)) {
      return next(new CustomError(`Meme(${memeId}) not found.`, HttpCode.NOT_FOUND));
    }

    logger.info(`Get meme - ${memeId})`);
    return res.json(createSuccessResponse(HttpCode.OK, 'Get Meme', meme));
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

const getMemeWithKeywords = async (req: Request, res: Response, next: NextFunction) => {
  const memeId = req.params?.memeId || null;

  if (_.isNull(memeId)) {
    return next(new CustomError(`'memeId' field should be provided`, HttpCode.BAD_REQUEST));
  }

  if (!mongoose.Types.ObjectId.isValid(memeId)) {
    return next(new CustomError(`'memeId' is not a valid ObjectId`, HttpCode.BAD_REQUEST));
  }

  try {
    const meme = await MemeService.getMemeWithKeywords(memeId);
    if (_.isNull(meme)) {
      return next(new CustomError(`Meme(${memeId}) not found.`, HttpCode.NOT_FOUND));
    }

    logger.info(`Get meme with keywords - ${memeId})`);
    return res.json(createSuccessResponse(HttpCode.OK, 'Get Meme', meme));
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

const createMeme = async (req: Request, res: Response, next: NextFunction) => {
  if (!_.has(req.body, 'title')) {
    return next(new CustomError(`'title' field should be provided`, HttpCode.BAD_REQUEST));
  }

  if (!_.has(req.body, 'image')) {
    return next(new CustomError(`'image' field should be provided`, HttpCode.BAD_REQUEST));
  }

  if (!_.has(req.body, 'source')) {
    return next(new CustomError(`'source' field should be provided`, HttpCode.BAD_REQUEST));
  }

  if (!_.has(req.body, 'keywordIds')) {
    return next(new CustomError(`'keywordIds' field should be provided`, HttpCode.BAD_REQUEST));
  }

  try {
    const meme = await MemeService.createMeme(req.body as IMemeCreatePayload);
    return res.json(createSuccessResponse(HttpCode.CREATED, 'Create Meme', meme));
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

const updateMeme = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const meme = req.requestedMeme;
  const updateInfo: IMemeUpdatePayload = req.body;

  try {
    const updatedMeme = await MemeService.updateMeme(meme._id, updateInfo);
    return res.json(createSuccessResponse(HttpCode.OK, 'Updated Meme', updatedMeme));
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

const deleteMeme = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const meme = req.requestedMeme;
  try {
    await MemeService.deleteMeme(meme._id);
    return res.json(createSuccessResponse(HttpCode.OK, 'Deleted Meme', true));
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

const getAllMemeList = async (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string) || 1;
  if (page < 1) {
    return next(new CustomError(`Invalid 'page' parameter`, HttpCode.BAD_REQUEST));
  }

  const size = parseInt(req.query.size as string) || 10;
  if (size < 1) {
    return next(new CustomError(`Invalid 'size' parameter`, HttpCode.BAD_REQUEST));
  }

  try {
    const memeList = await MemeService.getAllMemeList(page, size);

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

    return res.json(createSuccessResponse(HttpCode.OK, 'Get all meme list', data));
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
    return res.json(createSuccessResponse(HttpCode.OK, 'Get today meme list', todayMemeList));
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

const searchMemeByKeyword = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const keyword = req.requestedKeyword;

  try {
    const memeList = await MemeService.searchMemeByKeyword(keyword);
    return res.json(createSuccessResponse(HttpCode.OK, 'Search meme by keyword', memeList));
  } catch (err) {
    return next(new CustomError(err.message, err.status));
  }
};

export {
  getMeme,
  getTodayMemeList,
  getAllMemeList,
  createMeme,
  deleteMeme,
  updateMeme,
  getMemeWithKeywords,
  searchMemeByKeyword,
};
