"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_var_1 = __importDefault(require("env-var"));
const load_env_1 = require("./utils/load-env");
const nodeEnvironment = env_var_1.default.get('NODE_ENV').default('development').asString();
// loading environment variables before doing anything to ensure its availability everywhere
void (0, load_env_1.loadEnv)('.env', `.env.${nodeEnvironment}`, '.env.local', `.env.${nodeEnvironment}.local`);
// --
const chalk_1 = __importDefault(require("chalk"));
const detect_port_1 = __importDefault(require("detect-port"));
const logger_1 = require("./utils/logger");
const server_1 = require("./server");
async function main() {
    const PORT = await (0, detect_port_1.default)(env_var_1.default.get('PORT').default(3001).asPortNumber());
    server_1.server.listen(PORT, () => {
        const address = server_1.server.address();
        if (!address || typeof address === 'string') {
            logger_1.logger.error(`Server ${chalk_1.default.yellow('Serve')} Unable to determine server address`);
            return;
        }
        const { port } = address;
        const protocol = port === 443 ? 'https://' : 'http://';
        const url = port === 80 || port === 443
            ? `${protocol}localhost`
            : `${protocol}localhost:${port}`;
        logger_1.logger.info('node environment: %s', chalk_1.default.magentaBright(nodeEnvironment));
        logger_1.logger.info(`Server ${chalk_1.default.yellow('Serve')} ${chalk_1.default.underline('%s')}`, url);
    });
}
void main();
