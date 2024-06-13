import { randomUUID } from 'crypto';

import { Request, Response, NextFunction } from 'express';
import pino from 'pino';

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

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  logger.info(
    { method: req.method, url: req.originalUrl, body: req.body },
    `--> [${req.method}] ${req.originalUrl} Request called`,
  );

  const originalSend = res.send;
  res.send = (data) => {
    logger[res.statusCode !== 200 ? 'error' : 'info'](
      {
        statusCode: res.statusCode,
        duration: `${Date.now() - start}ms`,
        response: JSON.parse(data),
      },
      `<-- [${req.method}] ${res.statusCode} ${req.originalUrl} Response received in ${Date.now() - start}ms`,
    );
    return originalSend.bind(res)(data);
  };

  next();
};

logger.info('Logger Initialized!');

export { logger, loggerMiddleware, attachRequestId };
