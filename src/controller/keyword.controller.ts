import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';

import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';
import { CustomRequest } from '../middleware/requestedInfo';
import { IKeywordUpdatePayload } from '../model/keyword';
import * as KeywordService from '../service/keyword.service';
import * as MemeService from '../service/meme.service';
import { logger } from '../util/logger';
import { createSuccessResponse } from '../util/response';

const createKeyword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newKeyword = await KeywordService.createKeyword(req.body);
    logger.info(`Keyword created: ${JSON.stringify(newKeyword)}`);
    return res.json(createSuccessResponse(HttpCode.CREATED, 'Created Keyword', newKeyword));
  } catch (err) {
    return next(new CustomError(err.message, err.status || HttpCode.INTERNAL_SERVER_ERROR));
  }
};

const deleteKeyword = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const keyword = req.requestedKeyword;
  try {
    // 키워드 삭제
    // 키워드가 포함된 밈의 keywordIds도 삭제
    await Promise.all([
      KeywordService.deleteKeyword(keyword._id),
      MemeService.deleteKeywordOfMeme(keyword._id),
    ]);
    logger.info(`Deleted keyword with ID ${req.params.keywordId}`);
    return res.json(createSuccessResponse(HttpCode.OK, 'Deleted Keyword', true));
  } catch (err) {
    return next(new CustomError(err.message, err.status || HttpCode.INTERNAL_SERVER_ERROR));
  }
};

const getTopKeywords = async (req: Request, res: Response, next: NextFunction) => {
  const limit = 6;
  try {
    const topKeywords = await KeywordService.getTopKeywords(limit);
    // 키워드에 해당하는 밈 이미지 가져오기
    const promises = topKeywords.map(async (keyword) => {
      try {
        const topReactionImage = await MemeService.getTopReactionImage(keyword);
        keyword["topReactionImage"] = topReactionImage;
      } catch (error) {
        console.error(`Error fetching reaction image for keyword "${keyword}":`, error);
      }
    });

    await Promise.all(promises);

    logger.info(`Get top ${limit} keywords: ${JSON.stringify(topKeywords)}`);
    return res.json(createSuccessResponse(HttpCode.OK, 'Get Top Keywords', topKeywords));
  } catch (err) {
    return next(new CustomError(err.message, err.status || HttpCode.INTERNAL_SERVER_ERROR));
  }
};

const updateKeyword = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const keyword = req.requestedKeyword;
  const updateInfo: IKeywordUpdatePayload = req.body;
  try {
    const updatedKeyword = await KeywordService.updateKeyword(keyword._id, updateInfo);
    logger.info(`Updated keyword with ID ${req.params.keywordId}`);
    return res.json(createSuccessResponse(HttpCode.OK, 'Update Keyword', updatedKeyword));
  } catch (err) {
    return next(new CustomError(err.message, err.status || HttpCode.INTERNAL_SERVER_ERROR));
  }
};

const increaseSearchCount = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const keyword = req.requestedKeyword;
  try {
    const updatedKeyword = await KeywordService.increaseSearchCount(keyword._id);
    logger.info(`increaseed searchCount for keyword: ${JSON.stringify(updatedKeyword)}`);
    return res.json(
      createSuccessResponse(HttpCode.OK, 'Increase search Count for keyword', updatedKeyword),
    );
  } catch (err) {
    return next(new CustomError(err.message, err.status || HttpCode.INTERNAL_SERVER_ERROR));
  }
};

const getRecommendedKeywords = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const getRecommendedKeywords = await KeywordService.getRecommendedKeywords();
    logger.info(`Get recommended keywords by category: ${JSON.stringify(getRecommendedKeywords)}`);
    return res.json(
      createSuccessResponse(HttpCode.OK, 'Get Recommended Keywords', getRecommendedKeywords),
    );
  } catch (err) {
    return next(new CustomError(err.message, err.status || HttpCode.INTERNAL_SERVER_ERROR));
  }
};

export {
  createKeyword,
  updateKeyword,
  deleteKeyword,
  getTopKeywords,
  increaseSearchCount,
  getRecommendedKeywords,
};
