"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controller = void 0;
const express_1 = require("express");
const authorization_middleware_1 = require("../middlewares/authorization.middleware");
const client_1 = require("@prisma/client");
const express_helper_1 = require("@jmrl23/express-helper");
const question_list_dto_1 = require("../dtos/question-list.dto");
const question_service_1 = require("../services/question.service");
const question_get_dto_1 = require("../dtos/question-get.dto");
const question_update_dto_1 = require("../dtos/question-update.dto");
const question_delete_dto_1 = require("../dtos/question-delete.dto");
const question_create_dto_1 = require("../dtos/question-create.dto");
exports.controller = (0, express_1.Router)();
exports.controller
    .get('/get/:id', (0, express_helper_1.validate)('PARAMS', question_get_dto_1.QuestionGetDto), (0, express_helper_1.wrapper)(async function (request) {
    const questionService = await question_service_1.QuestionService.getInstance();
    const question = await questionService.getById(request.params.id);
    return {
        question,
    };
}))
    .post('/list', (0, express_helper_1.validate)('BODY', question_list_dto_1.QuestionListDto), (0, express_helper_1.wrapper)(async function (request) {
    const questionService = await question_service_1.QuestionService.getInstance();
    const questions = await questionService.list(request.body);
    return {
        questions,
    };
}))
    .use((0, authorization_middleware_1.authorizationMiddleware)(client_1.UserRole.ADMIN))
    .post('/create', (0, express_helper_1.validate)('BODY', question_create_dto_1.QuestionCreateDto), (0, express_helper_1.wrapper)(async function (request) {
    var _a;
    const questionService = await question_service_1.QuestionService.getInstance();
    const question = await questionService.create((_a = request.user) === null || _a === void 0 ? void 0 : _a.id, request.body);
    return {
        question,
    };
}))
    .patch('/update', (0, express_helper_1.validate)('BODY', question_update_dto_1.QuestionUpdateDto), (0, express_helper_1.wrapper)(async function (request) {
    const questionService = await question_service_1.QuestionService.getInstance();
    const question = await questionService.update(request.body);
    return {
        question,
    };
}))
    .delete('/delete/:id', (0, express_helper_1.validate)('PARAMS', question_delete_dto_1.QuestionDeleteDto), (0, express_helper_1.wrapper)(async function (request) {
    const questionService = await question_service_1.QuestionService.getInstance();
    const question = await questionService.delete(request.params.id);
    return {
        question,
    };
}));
