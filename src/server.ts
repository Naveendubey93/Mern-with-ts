import app from './app';
import { Config } from './config';
import logger from './config/logger';
const startServer = async () => {
  try {
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
