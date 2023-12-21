"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const chalk_1 = __importDefault(require("chalk"));
const env_var_1 = __importDefault(require("env-var"));
const express_1 = __importDefault(require("express"));
const cors_middleware_1 = require("./middlewares/cors.middleware");
const node_path_1 = require("node:path");
const logger_1 = require("./utils/logger");
const morgan_middleware_1 = require("./middlewares/morgan.middleware");
const express_helper_1 = require("@jmrl23/express-helper");
const prisma_better_errors_1 = require("prisma-better-errors");
const client_1 = require("@prisma/client");
const user_middleware_1 = require("./middlewares/user.middleware");
exports.app = (0, express_1.default)();
// configurations
exports.app.disable('x-powered-by');
// middlewares
exports.app.use((0, morgan_middleware_1.morganMiddleware)(), (0, cors_middleware_1.corsMiddleware)({
    origin: env_var_1.default.get('CORS_ORIGIN').default('*').asString(),
}), express_1.default.json({
    strict: true,
}), express_1.default.urlencoded({
    extended: true,
}), user_middleware_1.userMiddleware);
// public directory
exports.app.use(express_1.default.static((0, node_path_1.join)(__dirname, '../public')));
// controllers/ routes
const controllers = (0, express_helper_1.registerControllers)((0, node_path_1.join)(__dirname, './controllers'), '/', (controllers) => {
    for (const { filePath, controller } of controllers) {
        logger_1.logger.info(`Controller ${chalk_1.default.yellow('Register')} {%s} -> %s`, controller, filePath);
    }
});
exports.app.use(controllers);
exports.app.use(
// 404 error
(0, express_helper_1.wrapper)((request) => {
    throw new express_helper_1.vendors.httpErrors.NotFound(`Cannot ${request.method} ${request.path}`);
}), 
// custom error handler
(0, express_helper_1.errorHandler)((error, _request, _response, next) => {
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        error = new prisma_better_errors_1.prismaError(error);
    }
    if (!(error instanceof express_helper_1.vendors.httpErrors.HttpError)) {
        if (error instanceof Error) {
            if ('statusCode' in error && typeof error.statusCode === 'number') {
                error = express_helper_1.vendors.httpErrors.createHttpError(error.statusCode, error.message);
            }
        }
    }
    if (error instanceof Error) {
        logger_1.logger.error(error.stack);
    }
    next(error);
}));
