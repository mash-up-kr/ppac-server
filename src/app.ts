import express, { Application } from 'express';
import mongoose from 'mongoose';

import router from './routes';
import config from './util/config';
import { attachRequestId, logger } from './util/logger';

const DATABASE_URL = `${config.DB_URL}`;

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_, res) => {
  res.send('Hello! We are Farmeme');
});

app.use(attachRequestId);
app.use('/', router);

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(DATABASE_URL);
    logger.info('Connected to MongoDB');
  } catch (err) {
    logger.error('Error connecting to MongoDB', err);
    throw err;
  }
};

export default app;
