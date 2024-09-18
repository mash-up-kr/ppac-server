import { randomUUID } from 'crypto';

import { Request, Response, NextFunction } from 'express';
import pino from 'pino';

import config from './config';

const transport = pino.transport({
  targets: [
    {
      level: 'trace',
      target: 'pino-pretty',
      options: { colorize: true },
    },
  ],
});

const logger = pino(transport);

const attachRequestId = (req: Request, res: Response, next: NextFunction) => {
  req.id = randomUUID();
  next();
};

const ENV = `${config.ENV}`;
const isProduction = ENV === 'production';
logger.info(`env: ${ENV} - ${isProduction}`);

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const { method, originalUrl, body } = req;

  logger.info(
    isProduction ? undefined : { method, url: originalUrl, body },
    `--> ${method} ${originalUrl}`,
  );

  const originalSend = res.send;
  res.send = (data) => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    logger[statusCode !== 200 ? 'error' : 'info'](
      isProduction
        ? undefined
        : {
            method,
            url: originalUrl,
            response: JSON.parse(data),
          },
      `<-- ${statusCode} ${method} ${originalUrl} (${duration}ms)`,
    );

    return originalSend.bind(res)(data);
  };

  next();
};

logger.info('Logger Initialized!');

export { logger, loggerMiddleware, attachRequestId };
