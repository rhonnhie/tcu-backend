"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizationMiddleware = void 0;
const express_helper_1 = require("@jmrl23/express-helper");
const authorizationMiddleware = function authorizationMiddleware(...roles) {
    const [callback] = (0, express_helper_1.wrapper)(function (request, _response, next) {
        const authorizationBypassKey = process.env.AUTHORIZATION_BYPASS_KEY;
        if (typeof authorizationBypassKey === 'string' &&
            request.query['authorization_bypass_key'] === authorizationBypassKey) {
            return next();
        }
        if (!request.user || !roles.includes(request.user.role)) {
            throw express_helper_1.vendors.httpErrors.Unauthorized('You do not have permission for this action, cannot process your request');
        }
        next();
    });
    return callback;
};
exports.authorizationMiddleware = authorizationMiddleware;
