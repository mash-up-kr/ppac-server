import { NextFunction, Request, Response } from 'express';

import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';
import { logger } from '../util/logger';
import { createErrorResponse } from '../util/response';

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  logger.error({
    id: req?.id,
    err: { status: err.status, message: err.message, stack: err.stack },
  });

  if (err instanceof CustomError) {
    return res.status(err.status).json(createErrorResponse(err.status, err.message));
  } else {
    return res
      .status(HttpCode.INTERNAL_SERVER_ERROR)
      .json(createErrorResponse(HttpCode.INTERNAL_SERVER_ERROR, 'Internal Server Error'));
  }
};
