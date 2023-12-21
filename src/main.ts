import env from 'env-var';
import { loadEnv } from './utils/load-env';

const nodeEnvironment = env.get('NODE_ENV').default('development').asString();

// loading environment variables before doing anything to ensure its availability everywhere
void loadEnv(
  '.env',
  `.env.${nodeEnvironment}`,
  '.env.local',
  `.env.${nodeEnvironment}.local`,
);

// --

import chalk from 'chalk';
import port from 'detect-port';
import { logger } from './utils/logger';
import { server } from './server';

async function main(): Promise<void> {
  const PORT = await port(env.get('PORT').default(3001).asPortNumber());

  server.listen(PORT, () => {
    const address = server.address();

    if (!address || typeof address === 'string') {
      logger.error(
        `Server ${chalk.yellow('Serve')} Unable to determine server address`,
      );

      return;
    }

    const { port } = address;
    const protocol = port === 443 ? 'https://' : 'http://';
    const url =
      port === 80 || port === 443
        ? `${protocol}localhost`
        : `${protocol}localhost:${port}`;
        logger.info(
          'node environment: %s',
          chalk.magentaBright(nodeEnvironment),
        );
    logger.info(
      `Server ${chalk.yellow('Serve')} ${chalk.underline('%s')}`,
      url,
    );
    
  });
}

void main();
