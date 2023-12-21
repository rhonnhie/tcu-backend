"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionService = void 0;
const cache_service_1 = require("./cache.service");
const prisma_service_1 = require("./prisma.service");
const express_helper_1 = require("@jmrl23/express-helper");
class QuestionService {
    constructor(prismaService, cacheService) {
        this.prismaService = prismaService;
        this.cacheService = cacheService;
    }
    static async getInstance() {
        if (!QuestionService.instance) {
            const instance = new QuestionService(await prisma_service_1.PrismaService.getInstance(), await cache_service_1.CacheService.getInstance());
            QuestionService.instance = instance;
        }
        return QuestionService.instance;
    }
    async getById(id) {
        const prismaClient = await this.prismaService.getClient();
        const question = await prismaClient.question.findUnique({
            where: {
                id,
            },
        });
        if (!question) {
            throw new express_helper_1.vendors.httpErrors.NotFound('question not found');
        }
        await this.cacheService.set(`QuestionService[question][${question.id}]`, question);
        return question;
    }
    async list(questionListDto) {
        const cachedList = await this.cacheService.get(`QuestionService[list][${JSON.stringify(questionListDto)}]`);
        if (cachedList)
            return cachedList;
        const prismaClient = await this.prismaService.getClient();
        const questions = await prismaClient.question.findMany({
            orderBy: {
                created_at: 'desc',
            },
        });
        await this.cacheService.set(`QuestionService[list][${JSON.stringify(questionListDto)}]`, questions);
        return questions;
    }
    async create(userId, questionCreateDto) {
        const prismaClient = await this.prismaService.getClient();
        const question = await prismaClient.question.create({
            data: {
                question: questionCreateDto.question,
                answer: questionCreateDto.answer,
            },
        });
        await this.cacheService.set(`QuestionService[question][${question.id}]`, question);
        await this.resetList();
        return question;
    }
    async update(questionUpdateDto) {
        const prismaClient = await this.prismaService.getClient();
        const question = await prismaClient.question.update({
            where: {
                id: questionUpdateDto.id,
            },
            data: {
                question: questionUpdateDto.question,
                answer: questionUpdateDto.answer
            },
        });
        await this.cacheService.set(`QuestionService[question][${question.id}]`, question);
        await this.resetList();
        return question;
    }
    async delete(id) {
        const prismaClient = await this.prismaService.getClient();
        const question = await prismaClient.question.delete({
            where: {
                id,
            },
        });
        await this.cacheService.del(`QuestionService[question][${question.id}]`);
        await this.resetList();
        return question;
    }
    async resetList() {
        const cache = await this.cacheService.getCache();
        const keys = await cache.store.keys();
        const lists = keys.filter((key) => key.startsWith(`QuestionService[list]`));
        await Promise.all(lists.map((key) => this.cacheService.del(key)));
    }
}
exports.QuestionService = QuestionService;
