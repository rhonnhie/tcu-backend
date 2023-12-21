"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const chalk_1 = __importDefault(require("chalk"));
const env_var_1 = __importDefault(require("env-var"));
const winston_1 = require("winston");
exports.logger = (0, winston_1.createLogger)({
    level: env_var_1.default.get('NODE_ENV').default('development').asString() === 'development'
        ? 'debug'
        : 'info',
    format: winston_1.format.combine(winston_1.format.errors({ stack: true }), (0, winston_1.format)((info) => ({ ...info, level: info.level.toUpperCase() }))(), winston_1.format.colorize({ level: true }), winston_1.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.format.prettyPrint(), winston_1.format.splat(), winston_1.format.printf((info) => `${chalk_1.default.gray(`[${info.timestamp}]`)} ${chalk_1.default.bold(info.level)} ${info.message}`)),
    transports: [new winston_1.transports.Console()],
});
