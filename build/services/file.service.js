"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = void 0;
const multer_1 = __importStar(require("multer"));
const node_os_1 = require("node:os");
const drive_service_1 = require("./drive.service");
const prisma_service_1 = require("./prisma.service");
const express_helper_1 = require("@jmrl23/express-helper");
const node_fs_1 = require("node:fs");
class FileService {
    constructor(driveService, prismaService) {
        this.driveService = driveService;
        this.prismaService = prismaService;
    }
    static async getInstance() {
        if (!FileService.instance) {
            const instance = new FileService(await drive_service_1.DriveService.getInstance(), await prisma_service_1.PrismaService.getInstance());
            FileService.instance = instance;
        }
        return FileService.instance;
    }
    static multer() {
        return (0, multer_1.default)({
            storage: (0, multer_1.diskStorage)({
                destination: (0, node_os_1.tmpdir)(),
            }),
        });
    }
    async upload(userId, files) {
        const driveUploads = await Promise.allSettled(files.map((file) => this.driveService.create(file.path, file.originalname)));
        const driveFiles = [];
        for (const driveResponse of driveUploads) {
            if (driveResponse.status === 'fulfilled') {
                driveFiles.push(driveResponse.value);
            }
        }
        const prismaClient = await this.prismaService.getClient();
        const uploadedFiles = await Promise.all(driveFiles.map((file) => {
            const stat = (0, node_fs_1.statSync)(file.path);
            return prismaClient.file.create({
                data: {
                    name: file.name,
                    file_id: file.data.id,
                    mimetype: file.data.mimeType,
                    size: stat.size,
                    user_id: userId,
                },
            });
        }));
        return uploadedFiles;
    }
    async file(id, name) {
        const prismaClient = await this.prismaService.getClient();
        const file = await prismaClient.file.findFirst({
            where: {
                id,
                name,
            },
        });
        if (!file || !file.file_id) {
            throw new express_helper_1.vendors.httpErrors.NotFound('File not found');
        }
        const driveFile = await this.driveService.file(file.file_id);
        return {
            file,
            driveFile,
        };
    }
}
exports.FileService = FileService;
