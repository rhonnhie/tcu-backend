"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controller = void 0;
const express_1 = require("express");
const authorization_middleware_1 = require("../middlewares/authorization.middleware");
const client_1 = require("@prisma/client");
const express_helper_1 = require("@jmrl23/express-helper");
const event_create_dto_1 = require("../dtos/event-create.dto");
const event_service_1 = require("../services/event.service");
const event_get_dto_1 = require("../dtos/event-get.dto");
const event_list_dto_1 = require("../dtos/event-list.dto");
const event_update_dto_1 = require("../dtos/event-update.dto");
const event_delete_dto_1 = require("../dtos/event-delete.dto");
exports.controller = (0, express_1.Router)();
exports.controller
    .get('/get/:id', (0, express_helper_1.validate)('PARAMS', event_get_dto_1.EventGetDto), (0, express_helper_1.wrapper)(async function (request) {
    const eventService = await event_service_1.EventService.getInstance();
    const event = await eventService.getById(request.params.id);
    return {
        event,
    };
}))
    .post('/list', (0, express_helper_1.validate)('BODY', event_list_dto_1.EventListDto), (0, express_helper_1.wrapper)(async function (request) {
    const eventService = await event_service_1.EventService.getInstance();
    const events = await eventService.list(request.body);
    return {
        events,
    };
}))
    .use((0, authorization_middleware_1.authorizationMiddleware)(client_1.UserRole.ADMIN))
    .post('/create', (0, express_helper_1.validate)('BODY', event_create_dto_1.EventCreateDto), (0, express_helper_1.wrapper)(async function (request) {
    var _a;
    const eventService = await event_service_1.EventService.getInstance();
    const event = await eventService.create((_a = request.user) === null || _a === void 0 ? void 0 : _a.id, request.body);
    return {
        event,
    };
}))
    .patch('/update', (0, express_helper_1.validate)('BODY', event_update_dto_1.EventUpdateDto), (0, express_helper_1.wrapper)(async function (request) {
    const eventService = await event_service_1.EventService.getInstance();
    const event = await eventService.update(request.body);
    return {
        event,
    };
}))
    .delete('/delete/:id', (0, express_helper_1.validate)('PARAMS', event_delete_dto_1.EventDeleteDto), (0, express_helper_1.wrapper)(async function (request) {
    const eventService = await event_service_1.EventService.getInstance();
    const event = await eventService.delete(request.params.id);
    return {
        event,
    };
}));
