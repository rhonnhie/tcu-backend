import _multer, { Multer, diskStorage } from 'multer';
import { tmpdir } from 'node:os';
import { DriveService } from './drive.service';
import { PrismaService } from './prisma.service';
import { vendors } from '@jmrl23/express-helper';
import { statSync } from 'node:fs';
import { File } from '@prisma/client';
import internal from 'node:stream';

export class FileService {
  private static instance: FileService;

  private constructor(
    private readonly driveService: DriveService,
    private readonly prismaService: PrismaService,
  ) {}

  public static async getInstance(): Promise<FileService> {
    if (!FileService.instance) {
      const instance = new FileService(
        await DriveService.getInstance(),
        await PrismaService.getInstance(),
      );

      FileService.instance = instance;
    }

    return FileService.instance;
  }

  public static multer(): Multer {
    return _multer({
      storage: diskStorage({
        destination: tmpdir(),
      }),
    });
  }

  public async upload(
    userId: string | undefined,
    files: Express.Multer.File[],
  ): Promise<File[]> {
    const driveUploads = await Promise.allSettled(
      files.map((file) =>
        this.driveService.create(file.path, file.originalname),
      ),
    );
    const driveFiles: DriveFile[] = [];

    for (const driveResponse of driveUploads) {
      if (driveResponse.status === 'fulfilled') {
        driveFiles.push(driveResponse.value as DriveFile);
      }
    }

    const prismaClient = await this.prismaService.getClient();
    const uploadedFiles = await Promise.all(
      driveFiles.map((file) => {
        const stat = statSync(file.path);

        return prismaClient.file.create({
          data: {
            name: file.name,
            file_id: file.data.id,
            mimetype: file.data.mimeType,
            size: stat.size,
            user_id: userId,
          },
        });
      }),
    );

    return uploadedFiles;
  }

  public async file(
    id: string,
    name: string,
  ): Promise<{
    file: File;
    driveFile: internal.Readable;
  }> {
    const prismaClient = await this.prismaService.getClient();
    const file = await prismaClient.file.findFirst({
      where: {
        id,
        name,
      },
    });

    if (!file || !file.file_id) {
      throw new vendors.httpErrors.NotFound('File not found');
    }

    const driveFile = await this.driveService.file(file.file_id);

    return {
      file,
      driveFile,
    };
  }
}
