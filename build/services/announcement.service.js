"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnouncementService = void 0;
const cache_service_1 = require("./cache.service");
const prisma_service_1 = require("./prisma.service");
const express_helper_1 = require("@jmrl23/express-helper");
class AnnouncementService {
    constructor(prismaService, cacheService) {
        this.prismaService = prismaService;
        this.cacheService = cacheService;
    }
    static async getInstance() {
        if (!AnnouncementService.instance) {
            const instance = new AnnouncementService(await prisma_service_1.PrismaService.getInstance(), await cache_service_1.CacheService.getInstance());
            AnnouncementService.instance = instance;
        }
        return AnnouncementService.instance;
    }
    async getById(id) {
        const prismaClient = await this.prismaService.getClient();
        const announcement = await prismaClient.announcement.findUnique({
            where: {
                id,
            },
            include: {
                photo: true,
                attachments: true,
            },
        });
        if (!announcement) {
            throw new express_helper_1.vendors.httpErrors.NotFound('Announcement not found');
        }
        await this.cacheService.set(`AnnouncementService[announcement][${announcement.id}]`, announcement);
        return announcement;
    }
    async list(announcementListDto) {
        var _a, _b;
        const cachedList = await this.cacheService.get(`AnnouncementService[list][${JSON.stringify(announcementListDto)}]`);
        if (cachedList)
            return cachedList;
        const prismaClient = await this.prismaService.getClient();
        const announcements = await prismaClient.announcement.findMany({
            where: {
                created_at: {
                    gte: announcementListDto.created_at_from,
                    lte: announcementListDto.created_at_to,
                },
                updated_at: {
                    gte: announcementListDto.updated_at_from,
                    lte: announcementListDto.updated_at_to,
                },
                title: {
                    search: (_a = announcementListDto.keywords) === null || _a === void 0 ? void 0 : _a.join(' '),
                },
                content: {
                    search: (_b = announcementListDto.keywords) === null || _b === void 0 ? void 0 : _b.join(' '),
                },
                user_id: announcementListDto.user_id,
                pin: announcementListDto.pin,
            },
            skip: announcementListDto.skip,
            take: announcementListDto.take,
            orderBy: {
                created_at: 'desc',
            },
            include: {
                photo: true,
                attachments: true,
            },
        });
        await this.cacheService.set(`AnnouncementService[list][${JSON.stringify(announcementListDto)}]`, announcements);
        return announcements;
    }
    async create(userId, announcementCreateDto) {
        const prismaClient = await this.prismaService.getClient();
        const announcement = await prismaClient.announcement.create({
            data: {
                title: announcementCreateDto.title,
                content: announcementCreateDto.content,
                user_id: userId,
                photo_id: announcementCreateDto.photo_id,
                attachments: announcementCreateDto.attachments
                    ? {
                        connect: announcementCreateDto.attachments.map((id) => ({ id })),
                    }
                    : void 0,
            },
            include: {
                photo: true,
                attachments: true,
            },
        });
        await this.cacheService.set(`AnnouncementService[announcement][${announcement.id}]`, announcement);
        await this.resetList();
        return announcement;
    }
    async update(announcementUpdateDto) {
        const prismaClient = await this.prismaService.getClient();
        const announcement = await prismaClient.announcement.update({
            where: {
                id: announcementUpdateDto.id,
            },
            data: {
                title: announcementUpdateDto.title,
                content: announcementUpdateDto.content,
                pin: announcementUpdateDto.pin,
                photo_id: announcementUpdateDto.photo_id,
                attachments: announcementUpdateDto.attachments
                    ? {
                        connect: announcementUpdateDto.attachments.map((id) => ({ id })),
                    }
                    : void 0,
            },
            include: {
                photo: true,
                attachments: true,
            },
        });
        await this.cacheService.set(`AnnouncementService[announcement][${announcement.id}]`, announcement);
        await this.resetList();
        return announcement;
    }
    async delete(id) {
        const prismaClient = await this.prismaService.getClient();
        const announcement = await prismaClient.announcement.delete({
            where: {
                id,
            },
            include: {
                photo: true,
                attachments: true,
            },
        });
        await this.cacheService.del(`AnnouncementService[announcement][${announcement.id}]`);
        await this.resetList();
        return announcement;
    }
    async resetList() {
        const cache = await this.cacheService.getCache();
        const keys = await cache.store.keys();
        const lists = keys.filter((key) => key.startsWith(`AnnouncementService[list]`));
        await Promise.all(lists.map((key) => this.cacheService.del(key)));
    }
}
exports.AnnouncementService = AnnouncementService;
