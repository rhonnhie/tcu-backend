"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controller = void 0;
const express_helper_1 = require("@jmrl23/express-helper");
const express_1 = require("express");
const assistant_ask_dto_1 = require("../dtos/assistant-ask.dto");
const assistant_service_1 = require("../services/assistant.service");
exports.controller = (0, express_1.Router)();
exports.controller.post('/ask', (0, express_helper_1.validate)('BODY', assistant_ask_dto_1.AssistantAskDto), (0, express_helper_1.wrapper)(async function (request) {
    const assistantService = await assistant_service_1.AssistantService.getInstance();
    const data = await assistantService.ask(request.body);
    return {
        data,
    };
}));
