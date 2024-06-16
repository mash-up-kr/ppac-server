import app, { connectToDatabase } from './app';
import config from './util/config';
import { logger } from './util/logger';

const port = config.PORT;

const startServer = async () => {
  try {
    await connectToDatabase();
    app.listen(port, () => {
      logger.info(`Server started on port ${port}`);
    });
  } catch (err) {
    logger.error('Failed to start server', err);
  }
};

startServer();
