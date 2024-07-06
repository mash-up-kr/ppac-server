import express, { Application } from 'express';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import router from './routes';
import config from './util/config';
import { attachRequestId, logger } from './util/logger';

const DATABASE_URL = `${config.DB_URL}`;

const app: Application = express();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Farmeme API',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
