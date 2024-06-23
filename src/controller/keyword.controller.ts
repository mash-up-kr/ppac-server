import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';

import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';
import * as KeywordService from '../service/keyword.service';
import { logger } from '../util/logger';

const createKeyword = async (req: Request, res: Response, next: NextFunction) => {
  if (!_.has(req.body, 'name')) {
    return next(new CustomError(`'name' field should be provided`, HttpCode.BAD_REQUEST));
  }

  try {
    const newKeyword = await KeywordService.createKeyword(req.body);
    logger.info(`Keyword created: ${JSON.stringify(newKeyword)}`);
    return res.json(newKeyword);
  } catch (err) {
    return next(new CustomError(err.message, err.status || HttpCode.INTERNAL_SERVER_ERROR));
  }
};

const getTopKeywords = async (req: Request, res: Response, next: NextFunction) => {
  const limit = 6;
  try {
    const topKeywords = await KeywordService.getTopKeywords(limit);
    logger.info(`Get top ${limit} keywords: ${JSON.stringify(topKeywords)}`);
    return res.json(topKeywords);
  } catch (err) {
    return next(new CustomError(err.message, err.status || HttpCode.INTERNAL_SERVER_ERROR));
  }
};

const incrementSearchCount = async (req: Request, res: Response, next: NextFunction) => {
  const keywordId = req.params.keywordId;

  try {
    const updatedKeyword = await KeywordService.incrementSearchCount(keywordId);
    logger.info(`Incremented searchCount for keyword: ${JSON.stringify(updatedKeyword)}`);
    return res.json(updatedKeyword);
  } catch (err) {
    return next(new CustomError(err.message, err.status || HttpCode.INTERNAL_SERVER_ERROR));
  }
};

const addMemeToKeyword = async (req: Request, res: Response, next: NextFunction) => {
  const { keywordId } = req.params;
  const { memeId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(keywordId)) {
    return next(new CustomError('Invalid keyword ID', HttpCode.BAD_REQUEST));
  }

  if (!mongoose.Types.ObjectId.isValid(memeId)) {
    return next(new CustomError('Invalid meme ID', HttpCode.BAD_REQUEST));
  }

  try {
    const updatedKeyword = await KeywordService.addMemeToKeyword(keywordId, memeId);
    return res.status(200).json(updatedKeyword);
  } catch (err) {
    return next(new CustomError(err.message, err.status || HttpCode.INTERNAL_SERVER_ERROR));
  }
};

export { createKeyword, getTopKeywords, incrementSearchCount, addMemeToKeyword };
