"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEnv = void 0;
const chalk_1 = __importDefault(require("chalk"));
const dotenv_1 = __importDefault(require("dotenv"));
const node_path_1 = require("node:path");
const logger_1 = require("./logger");
const loadEnv = function loadEnv(...fileNames) {
    for (const fileName of fileNames) {
        const path = (0, node_path_1.join)(__dirname, `../../${fileName}`);
        const data = dotenv_1.default.config({ path, override: true }).parsed;
        if (!data || Object.keys(data).length < 1) {
            continue;
        }
        const name = (0, node_path_1.basename)(path);
        for (const key in data) {
            const value = data[key];
            logger_1.logger.debug(`DotEnv ${chalk_1.default.yellow('Var')} ${chalk_1.default.magentaBright(name)} ${chalk_1.default.gray('%s: %s')}`, key, value);
        }
    }
};
exports.loadEnv = loadEnv;
