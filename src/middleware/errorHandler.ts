import { NextFunction, Request, Response } from 'express';

import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';
import { logger } from '../util/logger';

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  logger.error({
    id: req?.id,
    err: { status: err.status, message: err.message, stack: err.stack },
  });

  if (err instanceof CustomError) {
    res.status(err.status).json({ error: { statusCode: err.status, message: err.message } });
  } else {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
      error: {
        statusCode: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      },
    });
  }
};
