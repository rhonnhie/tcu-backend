import { validate, wrapper } from '@jmrl23/express-helper';
import { Router } from 'express';
import { UserCreateDto } from '../dtos/user-create.dto';
import { authorizationMiddleware } from '../middlewares/authorization.middleware';
import { UserRole } from '@prisma/client';
import { UserService } from '../services/user.service';
import { UserSignInDto } from '../dtos/user-sign-in.dto';
import { UserUpdateDto } from '../dtos/user-update.dto';

export const controller = Router();

controller

  .get(
    '/session',
    wrapper(async function (request) {
      const user = request.user ?? null;

      return {
        user,
      };
    }),
  )

  .post(
    '/create',
    authorizationMiddleware(UserRole.ADMIN),
    validate('BODY', UserCreateDto),
    wrapper(async function (request) {
      const userService = await UserService.getInstance();
      const user = await userService.create(request.body);

      return {
        user,
      };
    }),
  )

  .post(
    '/sign-in',
    validate('BODY', UserSignInDto),
    wrapper(async function (request) {
      const userService = await UserService.getInstance();
      const token = await userService.signIn(request.body);

      return {
        token,
      };
    }),
  )

  .patch(
    '/update',
    authorizationMiddleware(UserRole.ADMIN),
    validate('BODY', UserUpdateDto),
    wrapper(async function (request) {
      const userService = await UserService.getInstance();
      const user = await userService.update(request.body);

      return {
        user,
      };
    }),
  );
