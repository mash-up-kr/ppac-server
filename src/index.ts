import express, { Application, Request, Response, json, urlencoded } from 'express';

import { logger, loggerMiddleware } from './util/logger';

async function startServer() {
  const app: Application = express();

  app.use(json());
  app.use(urlencoded({ extended: true }));

  app.get('/', (_req: Request, res: Response) => {
    res.send('Hello PPAC');
  });
  app.use(loggerMiddleware);

  app.listen(3000, () => {
    logger.info('Ready to start server');
  });
}

setImmediate(startServer);
