"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controller = void 0;
const express_helper_1 = require("@jmrl23/express-helper");
const express_1 = require("express");
const user_create_dto_1 = require("../dtos/user-create.dto");
const authorization_middleware_1 = require("../middlewares/authorization.middleware");
const client_1 = require("@prisma/client");
const user_service_1 = require("../services/user.service");
const user_sign_in_dto_1 = require("../dtos/user-sign-in.dto");
const user_update_dto_1 = require("../dtos/user-update.dto");
exports.controller = (0, express_1.Router)();
exports.controller
    .get('/session', (0, express_helper_1.wrapper)(async function (request) {
    var _a;
    const user = (_a = request.user) !== null && _a !== void 0 ? _a : null;
    return {
        user,
    };
}))
    .post('/create', (0, express_helper_1.validate)('BODY', user_create_dto_1.UserCreateDto), (0, express_helper_1.wrapper)(async function (request) {
    const userService = await user_service_1.UserService.getInstance();
    const user = await userService.create(request.body);
    return {
        user,
    };
}))
    .post('/sign-in', (0, express_helper_1.validate)('BODY', user_sign_in_dto_1.UserSignInDto), (0, express_helper_1.wrapper)(async function (request) {
    const userService = await user_service_1.UserService.getInstance();
    const token = await userService.signIn(request.body);
    return {
        token,
    };
}))
    .patch('/update', (0, authorization_middleware_1.authorizationMiddleware)(client_1.UserRole.ADMIN), (0, express_helper_1.validate)('BODY', user_update_dto_1.UserUpdateDto), (0, express_helper_1.wrapper)(async function (request) {
    const userService = await user_service_1.UserService.getInstance();
    const user = await userService.update(request.body);
    return {
        user,
    };
}));
