"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const client_1 = require("@prisma/client");
class PrismaService {
    constructor() { }
    static async getInstance() {
        if (!PrismaService.instance) {
            PrismaService.instance = new PrismaService();
        }
        return PrismaService.instance;
    }
    async getClient() {
        if (!PrismaService.prismaClient) {
            PrismaService.prismaClient = new client_1.PrismaClient();
            await PrismaService.prismaClient.$connect();
        }
        return PrismaService.prismaClient;
    }
    async disconnect() {
        const prismaClient = await this.getClient();
        await prismaClient.$disconnect();
    }
}
exports.PrismaService = PrismaService;
