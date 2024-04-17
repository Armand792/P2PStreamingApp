/**
 * @file Server.
 */

import app from './app';
import 'dotenv/config';
import logger from './utils/logger';

const port = process.env.PORT || 8080;
const signals = ['SIGINT', 'SIGTERM'];

const server = app.listen(port, async () => {
  logger.info(`Running on port ${port}`);
});

const shutdown = async (signal: string) => {
  server.close(async () => {
    logger.info(`Stopped by ${signal}`);
  });
};

signals.forEach((signal) => {
  process.on(signal, () => {
    shutdown(signal);
  });
});
