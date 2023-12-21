"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controller = void 0;
const express_1 = require("express");
const authorization_middleware_1 = require("../middlewares/authorization.middleware");
const client_1 = require("@prisma/client");
const express_helper_1 = require("@jmrl23/express-helper");
const announcement_list_dto_1 = require("../dtos/announcement-list.dto");
const announcement_service_1 = require("../services/announcement.service");
const announcement_get_dto_1 = require("../dtos/announcement-get.dto");
const announcement_update_dto_1 = require("../dtos/announcement-update.dto");
const announcement_delete_dto_1 = require("../dtos/announcement-delete.dto");
const announcement_create_dto_1 = require("../dtos/announcement-create.dto");
exports.controller = (0, express_1.Router)();
exports.controller
    .get('/get/:id', (0, express_helper_1.validate)('PARAMS', announcement_get_dto_1.AnnouncementGetDto), (0, express_helper_1.wrapper)(async function (request) {
    const announcementService = await announcement_service_1.AnnouncementService.getInstance();
    const announcement = await announcementService.getById(request.params.id);
    return {
        announcement,
    };
}))
    .post('/list', (0, express_helper_1.validate)('BODY', announcement_list_dto_1.AnnouncementListDto), (0, express_helper_1.wrapper)(async function (request) {
    const announcementService = await announcement_service_1.AnnouncementService.getInstance();
    const announcements = await announcementService.list(request.body);
    return {
        announcements,
    };
}))
    .use((0, authorization_middleware_1.authorizationMiddleware)(client_1.UserRole.ADMIN))
    .post('/create', (0, express_helper_1.validate)('BODY', announcement_create_dto_1.AnnouncementCreateDto), (0, express_helper_1.wrapper)(async function (request) {
    var _a;
    const announcementService = await announcement_service_1.AnnouncementService.getInstance();
    const announcement = await announcementService.create((_a = request.user) === null || _a === void 0 ? void 0 : _a.id, request.body);
    return {
        announcement,
    };
}))
    .patch('/update', (0, express_helper_1.validate)('BODY', announcement_update_dto_1.AnnouncementUpdateDto), (0, express_helper_1.wrapper)(async function (request) {
    const announcementService = await announcement_service_1.AnnouncementService.getInstance();
    const announcement = await announcementService.update(request.body);
    return {
        announcement,
    };
}))
    .delete('/delete/:id', (0, express_helper_1.validate)('PARAMS', announcement_delete_dto_1.AnnouncementDeleteDto), (0, express_helper_1.wrapper)(async function (request) {
    const announcementService = await announcement_service_1.AnnouncementService.getInstance();
    const announcement = await announcementService.delete(request.params.id);
    return {
        announcement,
    };
}));
