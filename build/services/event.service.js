"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
const cache_service_1 = require("./cache.service");
const prisma_service_1 = require("./prisma.service");
const express_helper_1 = require("@jmrl23/express-helper");
class EventService {
    constructor(prismaService, cacheService) {
        this.prismaService = prismaService;
        this.cacheService = cacheService;
    }
    static async getInstance() {
        if (!EventService.instance) {
            const instance = new EventService(await prisma_service_1.PrismaService.getInstance(), await cache_service_1.CacheService.getInstance());
            EventService.instance = instance;
        }
        return EventService.instance;
    }
    async getById(id) {
        const prismaClient = await this.prismaService.getClient();
        const event = await prismaClient.event.findUnique({
            where: {
                id,
            },
            include: {
                photo: true,
                attachments: true,
            },
        });
        if (!event) {
            throw express_helper_1.vendors.httpErrors.NotFound('Event not found');
        }
        await this.cacheService.set(`EventService[event][${event.id}]`, event);
        return event;
    }
    async list(eventListDto) {
        var _a, _b;
        const cachedList = await this.cacheService.get(`EventService[list][${JSON.stringify(eventListDto)}]`);
        if (cachedList)
            return cachedList;
        const prismaClient = await this.prismaService.getClient();
        const events = await prismaClient.event.findMany({
            where: {
                created_at: {
                    gte: eventListDto.created_at_from,
                    lte: eventListDto.created_at_to,
                },
                updated_at: {
                    gte: eventListDto.updated_at_from,
                    lte: eventListDto.updated_at_to,
                },
                date_of_event: {
                    gte: eventListDto.date_of_event_from,
                    lte: eventListDto.date_of_event_to,
                },
                title: {
                    search: (_a = eventListDto.keywords) === null || _a === void 0 ? void 0 : _a.join(' '),
                },
                content: {
                    search: (_b = eventListDto.keywords) === null || _b === void 0 ? void 0 : _b.join(' '),
                },
                user_id: eventListDto.user_id,
            },
            skip: eventListDto.skip,
            take: eventListDto.take,
            orderBy: {
                created_at: 'desc',
            },
            include: {
                photo: true,
                attachments: true,
            },
        });
        await this.cacheService.set(`EventService[list][${JSON.stringify(eventListDto)}]`, events);
        return events;
    }
    async create(user_id, eventCreateDto) {
        const prismaClient = await this.prismaService.getClient();
        const event = await prismaClient.event.create({
            data: {
                title: eventCreateDto.title,
                content: eventCreateDto.content,
                date_of_event: eventCreateDto.date_of_event,
                user_id,
                photo_id: eventCreateDto.photo_id,
                attachments: eventCreateDto.attachments
                    ? { connect: eventCreateDto.attachments.map((id) => ({ id })) }
                    : void 0,
            },
            include: {
                photo: true,
                attachments: true,
            },
        });
        await this.cacheService.set(`EventService[event][${event.id}]`, event);
        await this.resetList();
        return event;
    }
    async update(eventUpdateDto) {
        const prismaClient = await this.prismaService.getClient();
        const event = await prismaClient.event.update({
            where: {
                id: eventUpdateDto.id,
            },
            data: {
                title: eventUpdateDto.title,
                content: eventUpdateDto.content,
                date_of_event: eventUpdateDto.date_of_event,
                photo_id: eventUpdateDto.photo_id,
                attachments: eventUpdateDto.attachments
                    ? { connect: eventUpdateDto.attachments.map((id) => ({ id })) }
                    : void 0,
            },
            include: {
                photo: true,
                attachments: true,
            },
        });
        await this.cacheService.set(`EventService[event][${event.id}]`, event);
        await this.resetList();
        return event;
    }
    async delete(id) {
        const prismaClient = await this.prismaService.getClient();
        const event = await prismaClient.event.delete({
            where: {
                id,
            },
            include: {
                photo: true,
                attachments: true,
            },
        });
        await this.cacheService.del(`EventService[event][${event.id}]`);
        await this.resetList();
        return event;
    }
    async resetList() {
        const cache = await this.cacheService.getCache();
        const keys = await cache.store.keys();
        const lists = keys.filter((key) => key.startsWith(`EventService[list]`));
        await Promise.all(lists.map((key) => this.cacheService.del(key)));
    }
}
exports.EventService = EventService;
