import app from './app';
import { Config } from './config';
import { AppDataSource } from './config/data-source';
import logger from './config/logger';
const startServer = async () => {
  try {
    await AppDataSource.initialize();
    logger.info('Database connected successfully');
    app.listen(Config.PORT, () => {
      logger.info(`Listening on ${Config.PORT}`);
    });
  } catch (e) {
    if (e instanceof Error) {
      logger.error(e.message);
      setTimeout(() => {
        process.exit(1);
      });
    }
  }
};
startServer();
