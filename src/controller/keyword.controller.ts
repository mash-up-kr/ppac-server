import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';

import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';
import * as KeywordService from '../service/keyword.service';
import { CustomRequest } from '../middleware/requestedInfo';
import { logger } from '../util/logger';
import { IKeywordCreatePayload, IKeywordUpdatePayload } from 'src/model/keyword';

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

const deleteKeyword = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const keyword = req.requestedKeyword;
  try {
    const deletedKeyword = await KeywordService.deleteKeyword(keyword._id as string);
    logger.info(`Deleted keyword with ID ${req.params.keywordId}`);
    return res.json({ success: true, deletedKeyword });
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

const updateKeyword = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const keyword = req.requestedKeyword;
  const updateInfo: IKeywordUpdatePayload = req.body;
  try {
    const updatedKeyword = await KeywordService.updateKeyword(keyword._id as string, updateInfo);
    logger.info(`Updated keyword with ID ${req.params.keywordId}`);
    return res.json({ success: true, updatedKeyword });
  } catch (err) {
    return next(new CustomError(err.message, err.status || HttpCode.INTERNAL_SERVER_ERROR));
  }
};

const increaseSearchCount = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const keyword = req.requestedKeyword;
  try {
    const updatedKeyword = await KeywordService.increaseSearchCount(keyword._id);
    logger.info(`increaseed searchCount for keyword: ${JSON.stringify(updatedKeyword)}`);
    return res.json(updatedKeyword);
  } catch (err) {
    return next(new CustomError(err.message, err.status || HttpCode.INTERNAL_SERVER_ERROR));
  }
};

export { createKeyword, updateKeyword, deleteKeyword, getTopKeywords, increaseSearchCount };
