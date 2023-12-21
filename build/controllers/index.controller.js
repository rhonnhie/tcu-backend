"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controller = void 0;
const express_helper_1 = require("@jmrl23/express-helper");
const express_1 = require("express");
const node_path_1 = require("node:path");
const node_fs_1 = require("node:fs");
const yaml_1 = require("yaml");
const swagger_ui_express_1 = require("swagger-ui-express");
exports.controller = (0, express_1.Router)();
const data = (0, yaml_1.parse)((0, node_fs_1.readFileSync)((0, node_path_1.join)(__dirname, '../../swagger.yaml'), { encoding: 'utf-8' }));
exports.controller
    .get('/', (0, express_helper_1.wrapper)(function (_request, response) {
    response.redirect('/swagger');
}))
    .use('/swagger', swagger_ui_express_1.serve)
    .get('/swagger', (0, swagger_ui_express_1.setup)(data))
    .get('/swagger.json', (0, express_helper_1.wrapper)(() => data));
