import { type Prisma } from '@prisma/client';
import { AnnouncementCreateDto } from '../dtos/announcement-create.dto';
import { CacheService } from './cache.service';
import { PrismaService } from './prisma.service';
import { AnnouncementUpdateDto } from '../dtos/announcement-update.dto';
import { AnnouncementListDto } from '../dtos/announcement-list.dto';
import { vendors } from '@jmrl23/express-helper';

export class AnnouncementService {
  private static instance: AnnouncementService;

  private constructor(
    private readonly prismaService: PrismaService,
    private readonly cacheService: CacheService,
  ) {}

  public static async getInstance(): Promise<AnnouncementService> {
    if (!AnnouncementService.instance) {
      const instance = new AnnouncementService(
        await PrismaService.getInstance(),
        await CacheService.getInstance(),
      );

      AnnouncementService.instance = instance;
    }

    return AnnouncementService.instance;
  }

  public async getById(
    id: string,
  ): Promise<AnnouncementWithPhotoAndAttachments | null> {
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
      throw new vendors.httpErrors.NotFound('Announcement not found');
    }

    await this.cacheService.set(
      `AnnouncementService[announcement][${announcement.id}]`,
      announcement,
    );

    return announcement;
  }

  public async list(
    announcementListDto: AnnouncementListDto,
  ): Promise<AnnouncementWithPhotoAndAttachments[]> {
    const cachedList = await this.cacheService.get<
      AnnouncementWithPhotoAndAttachments[]
    >(`AnnouncementService[list][${JSON.stringify(announcementListDto)}]`);

    if (cachedList) return cachedList;

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
          search: announcementListDto.keywords?.join(' '),
        },
        content: {
          search: announcementListDto.keywords?.join(' '),
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

    await this.cacheService.set(
      `AnnouncementService[list][${JSON.stringify(announcementListDto)}]`,
      announcements,
    );

    return announcements;
  }

  public async create(
    userId: string | undefined,
    announcementCreateDto: AnnouncementCreateDto,
  ): Promise<AnnouncementWithPhotoAndAttachments> {
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

    await this.cacheService.set(
      `AnnouncementService[announcement][${announcement.id}]`,
      announcement,
    );
    await this.resetList();

    return announcement;
  }

  public async update(
    announcementUpdateDto: AnnouncementUpdateDto,
  ): Promise<AnnouncementWithPhotoAndAttachments> {
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

    await this.cacheService.set(
      `AnnouncementService[announcement][${announcement.id}]`,
      announcement,
    );
    await this.resetList();

    return announcement;
  }

  public async delete(
    id: string,
  ): Promise<AnnouncementWithPhotoAndAttachments> {
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

    await this.cacheService.del(
      `AnnouncementService[announcement][${announcement.id}]`,
    );
    await this.resetList();

    return announcement;
  }

  private async resetList(): Promise<void> {
    const cache = await this.cacheService.getCache();
    const keys = await cache.store.keys();
    const lists = keys.filter((key) =>
      key.startsWith(`AnnouncementService[list]`),
    );

    await Promise.all(lists.map((key) => this.cacheService.del(key)));
  }
}

export type AnnouncementWithPhotoAndAttachments =
  Prisma.AnnouncementGetPayload<{
    include: {
      photo: true;
      attachments: true;
    };
  }>;
