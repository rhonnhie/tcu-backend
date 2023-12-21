"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.morganMiddleware = void 0;
const morgan_1 = __importDefault(require("morgan"));
const chalk_1 = __importDefault(require("chalk"));
const logger_1 = require("../utils/logger");
const morganMiddleware = function morganMiddleware() {
    const format = ':remote-addr :method :url :status :res[content-length] - :response-time ms';
    return (0, morgan_1.default)(format, {
        stream: {
            write: (message) => {
                logger_1.logger.http(chalk_1.default.gray(message.trim()));
            },
        },
    });
};
exports.morganMiddleware = morganMiddleware;
