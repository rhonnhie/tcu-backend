"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
const user_service_1 = require("../services/user.service");
exports.userMiddleware = async function userMiddleware(request, _response, next) {
    var _a, _b;
    const [scheme, token] = (_b = (_a = request.header('authorization')) === null || _a === void 0 ? void 0 : _a.split(' ')) !== null && _b !== void 0 ? _b : [];
    if (scheme !== 'Bearer')
        return next();
    const userService = await user_service_1.UserService.getInstance();
    const user = await userService.getUserByToken(token);
    if (user) {
        request.user = user;
    }
    next();
};
