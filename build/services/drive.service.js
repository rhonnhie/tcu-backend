"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriveService = void 0;
const googleapis_1 = require("googleapis");
const node_fs_1 = require("node:fs");
const express_helper_1 = require("@jmrl23/express-helper");
const mime_types_1 = require("mime-types");
const node_crypto_1 = require("node:crypto");
class DriveService {
    constructor(clientId, clientSecret, playgroundUrl, refreshToken, driveFolderId) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.playgroundUrl = playgroundUrl;
        this.refreshToken = refreshToken;
        this.driveFolderId = driveFolderId;
    }
    static async getInstance() {
        if (!DriveService.instance) {
            const instance = new DriveService(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_PLAYGROUND_URL, process.env.GOOGLE_REFRESH_TOKEN, process.env.DRIVE_FOLDER_ID);
            DriveService.instance = instance;
        }
        return DriveService.instance;
    }
    getDrive() {
        const oauth2Client = new googleapis_1.google.auth.OAuth2(this.clientId, this.clientSecret, this.playgroundUrl);
        oauth2Client.setCredentials({
            refresh_token: this.refreshToken,
        });
        const drive = googleapis_1.google.drive({
            version: 'v3',
            auth: oauth2Client,
        });
        return drive;
    }
    async create(path, name) {
        if (!(0, node_fs_1.existsSync)(path)) {
            throw new express_helper_1.vendors.httpErrors.NotFound('File not found');
        }
        const mimeType = (0, mime_types_1.lookup)(name) || 'application/octet-stream';
        const drive = this.getDrive();
        const response = await drive.files.create({
            media: {
                mimeType,
                body: (0, node_fs_1.createReadStream)(path),
            },
            requestBody: {
                mimeType,
                name: `${new Date().toJSON()}-${(0, node_crypto_1.randomUUID)()}-${name}`,
                parents: this.driveFolderId ? [this.driveFolderId] : void 0,
            },
        });
        if (response.status < 200 || response.status > 399) {
            throw new express_helper_1.vendors.httpErrors.InternalServerError(response.statusText);
        }
        return {
            path,
            name,
            data: response.data,
        };
    }
    async file(fileId) {
        const drive = this.getDrive();
        const fileStream = await drive.files.get({
            fileId,
            alt: 'media',
        }, {
            responseType: 'stream',
        });
        if (fileStream.status > 399) {
            throw new express_helper_1.vendors.httpErrors.InternalServerError('An error occurs');
        }
        return fileStream.data;
    }
}
exports.DriveService = DriveService;
