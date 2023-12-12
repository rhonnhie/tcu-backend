import chalk from 'chalk';
import dotenv from 'dotenv';
import { join, basename } from 'node:path';
import { logger } from './logger';

export const loadEnv = function loadEnv(...fileNames: string[]): void {
  for (const fileName of fileNames) {
    const path = join(__dirname, `../../${fileName}`);
    const data = dotenv.config({ path, override: true }).parsed;

    if (!data || Object.keys(data).length < 1) {
      continue;
    }

    const name = basename(path);

    for (const key in data) {
      const value = data[key];

      logger.debug(
        `DotEnv ${chalk.yellow('Var')} ${chalk.magentaBright(
          name,
        )} ${chalk.gray('%s: %s')}`,
        key,
        value,
      );
    }
  }
};
