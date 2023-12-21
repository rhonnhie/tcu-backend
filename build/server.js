"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const node_http_1 = require("node:http");
const app_1 = require("./app");
exports.server = (0, node_http_1.createServer)(app_1.app);
