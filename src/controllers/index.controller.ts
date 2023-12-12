import { wrapper } from '@jmrl23/express-helper';
import { Router } from 'express';
import { join } from 'node:path';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { serve, setup } from 'swagger-ui-express';

export const controller = Router();

const data = parse(
  readFileSync(join(__dirname, '../../swagger.yaml'), { encoding: 'utf-8' }),
);

controller

  .get(
    '/',
    wrapper(function (_request, response) {
      response.redirect('/swagger');
    }),
  )

  .use('/swagger', serve)

  .get('/swagger', setup(data))

  .get(
    '/swagger.json',
    wrapper(() => data),
  );
