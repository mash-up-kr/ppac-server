import express, { Application, Request, Response, json, urlencoded } from 'express';
import mongoose from 'mongoose';

import router from './routes';
import config from './util/config';
import { attachRequestId, logger } from './util/logger';

const DATABASE_URL = `${config.DB_URL}`;

async function startServer() {
  const app: Application = express();
  await mongoose.connect(DATABASE_URL);
  logger.info('Database Connected');

  app.use(json());
  app.use(urlencoded({ extended: true }));

  app.get('/', (_req: Request, res: Response) => {
    res.send('Hello PPAC');
  });

  app.use(attachRequestId);

  app.use('/', router);

  app.listen(3000, () => {
    logger.info('Ready to start server');
  });
}

setImmediate(startServer);
