"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controller = void 0;
const express_1 = require("express");
const authorization_middleware_1 = require("../middlewares/authorization.middleware");
const client_1 = require("@prisma/client");
const file_service_1 = require("../services/file.service");
const express_helper_1 = require("@jmrl23/express-helper");
const drive_service_1 = require("../services/drive.service");
const file_get_dto_1 = require("../dtos/file-get.dto");
exports.controller = (0, express_1.Router)();
exports.controller
    .post('/upload', (0, authorization_middleware_1.authorizationMiddleware)(client_1.UserRole.ADMIN), file_service_1.FileService.multer().array('files'), (0, express_helper_1.wrapper)(async function (request) {
    var _a;
    const fileService = await file_service_1.FileService.getInstance();
    const files = await fileService.upload((_a = request.user) === null || _a === void 0 ? void 0 : _a.id, request.files || []);
    return {
        files,
    };
}))
    .get('/get/:id/:name', (0, express_helper_1.validate)('PARAMS', file_get_dto_1.FileGetDto), (0, express_helper_1.wrapper)(async function (request, response) {
    var _a;
    const fileService = await file_service_1.FileService.getInstance();
    const { file } = await fileService.file(request.params.id, request.params.name);
    const driveService = await drive_service_1.DriveService.getInstance();
    const fileStream = await driveService.file((_a = file.file_id) !== null && _a !== void 0 ? _a : '');
    response.setHeader('Content-Length', file.size);
    response.setHeader('Content-Type', file.mimetype);
    response.setHeader('Cache-Control', 'max-age=3600');
    fileStream.pipe(response);
}));
