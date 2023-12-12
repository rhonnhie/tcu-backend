import { type RequestHandler } from 'express';
import { UserService } from '../services/user.service';

export const userMiddleware = async function userMiddleware(
  request,
  _response,
  next,
) {
  const [scheme, token] = request.header('authorization')?.split(' ') ?? [];

  if (scheme !== 'Bearer') return next();

  const userService = await UserService.getInstance();
  const user = await userService.getUserByToken(token);

  if (user) {
    request.user = user;
  }

  next();
} satisfies RequestHandler;
