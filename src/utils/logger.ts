import chalk from 'chalk';
import env from 'env-var';
import { createLogger, transports, format } from 'winston';

export const logger = createLogger({
  level:
    env.get('NODE_ENV').default('development').asString() === 'development'
      ? 'debug'
      : 'info',
  format: format.combine(
    format.errors({ stack: true }),
    format((info) => ({ ...info, level: info.level.toUpperCase() }))(),
    format.colorize({ level: true }),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.prettyPrint(),
    format.splat(),
    format.printf(
      (info) =>
        `${chalk.gray(`[${info.timestamp}]`)} ${chalk.bold(info.level)} ${
          info.message
        }`,
    ),
  ),
  transports: [new transports.Console()],
});
