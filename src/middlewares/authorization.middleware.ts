import { wrapper, vendors } from '@jmrl23/express-helper';
import { UserRole } from '@prisma/client';

export const authorizationMiddleware = function authorizationMiddleware(
  ...roles: UserRole[]
) {
  const [callback] = wrapper(function (request, _response, next) {
    const authorizationBypassKey = process.env.AUTHORIZATION_BYPASS_KEY;

    if (
      typeof authorizationBypassKey === 'string' &&
      request.query['authorization_bypass_key'] === authorizationBypassKey
    ) {
      return next();
    }

    if (!request.user || !roles.includes(request.user.role)) {
      throw vendors.httpErrors.Unauthorized(
        'You do not have permission for this action, cannot process your request',
      );
    }

    next();
  });

  return callback;
};
