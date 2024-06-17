import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';

import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';
import * as KeywordService from '../service/keyword.service';
import { logger } from '../util/logger';

const getTopKeywords = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const topKeywords = await KeywordService.getTopKeywords(6);
    logger.info('Get top 6 keywords');
    return res.json(topKeywords);
  } catch (err) {
    return next(new CustomError(err.message, err.status || HttpCode.INTERNAL_SERVER_ERROR));
  }
};

export { getTopKeywords };
