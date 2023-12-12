import { drive_v3, google } from 'googleapis';
import { createReadStream, existsSync } from 'node:fs';
import { vendors } from '@jmrl23/express-helper';
import { lookup } from 'mime-types';
import { randomUUID } from 'node:crypto';
import internal from 'node:stream';

export class DriveService {
  private static instance: DriveService;

  private constructor(
    private readonly clientId?: string,
    private readonly clientSecret?: string,
    private readonly playgroundUrl?: string,
    private readonly refreshToken?: string,
    private readonly driveFolderId?: string,
  ) {}

  public static async getInstance(): Promise<DriveService> {
    if (!DriveService.instance) {
      const instance = new DriveService(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_PLAYGROUND_URL,
        process.env.GOOGLE_REFRESH_TOKEN,
        process.env.DRIVE_FOLDER_ID,
      );

      DriveService.instance = instance;
    }

    return DriveService.instance;
  }

  public getDrive(): drive_v3.Drive {
    const oauth2Client = new google.auth.OAuth2(
      this.clientId,
      this.clientSecret,
      this.playgroundUrl,
    );

    oauth2Client.setCredentials({
      refresh_token: this.refreshToken,
    });

    const drive = google.drive({
      version: 'v3',
      auth: oauth2Client,
    });

    return drive;
  }

  public async create(
    path: string,
    name: string,
  ): Promise<{ path: string; name: string; data: drive_v3.Schema$File }> {
    if (!existsSync(path)) {
      throw new vendors.httpErrors.NotFound('File not found');
    }

    const mimeType = lookup(name) || 'application/octet-stream';
    const drive = this.getDrive();
    const response = await drive.files.create({
      media: {
        mimeType,
        body: createReadStream(path),
      },
      requestBody: {
        mimeType,
        name: `${new Date().toJSON()}-${randomUUID()}-${name}`,
        parents: this.driveFolderId ? [this.driveFolderId] : void 0,
      },
    });

    if (response.status < 200 || response.status > 399) {
      throw new vendors.httpErrors.InternalServerError(response.statusText);
    }

    return {
      path,
      name,
      data: response.data,
    };
  }

  async file(fileId: string): Promise<internal.Readable> {
    const drive = this.getDrive();
    const fileStream = await drive.files.get(
      {
        fileId,
        alt: 'media',
      },
      {
        responseType: 'stream',
      },
    );

    if (fileStream.status > 399) {
      throw new vendors.httpErrors.InternalServerError('An error occurs');
    }

    return fileStream.data;
  }
}
