import morgan from 'morgan';
import chalk from 'chalk';
import { logger } from '../utils/logger';

export const morganMiddleware = function morganMiddleware() {
  const format =
    ':remote-addr :method :url :status :res[content-length] - :response-time ms';

  return morgan(format, {
    stream: {
      write: (message) => {
        logger.http(chalk.gray(message.trim()));
      },
    },
  });
};
