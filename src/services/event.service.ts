import { type Prisma } from '@prisma/client';
import { EventCreateDto } from '../dtos/event-create.dto';
import { CacheService } from './cache.service';
import { PrismaService } from './prisma.service';
import { EventListDto } from '../dtos/event-list.dto';
import { EventUpdateDto } from '../dtos/event-update.dto';
import { vendors } from '@jmrl23/express-helper';

export class EventService {
  private static instance: EventService;

  private constructor(
    private readonly prismaService: PrismaService,
    private readonly cacheService: CacheService,
  ) {}

  public static async getInstance(): Promise<EventService> {
    if (!EventService.instance) {
      const instance = new EventService(
        await PrismaService.getInstance(),
        await CacheService.getInstance(),
      );

      EventService.instance = instance;
    }

    return EventService.instance;
  }

  public async getById(
    id: string,
  ): Promise<Promise<EventWithPhotoAndAttachments | null>> {
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
      throw vendors.httpErrors.NotFound('Event not found');
    }

    await this.cacheService.set(`EventService[event][${event.id}]`, event);

    return event;
  }

  public async list(
    eventListDto: EventListDto,
  ): Promise<EventWithPhotoAndAttachments[]> {
    const cachedList = await this.cacheService.get<
      EventWithPhotoAndAttachments[]
    >(`EventService[list][${JSON.stringify(eventListDto)}]`);

    if (cachedList) return cachedList;

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
          search: eventListDto.keywords?.join(' '),
        },
        content: {
          search: eventListDto.keywords?.join(' '),
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

    await this.cacheService.set(
      `EventService[list][${JSON.stringify(eventListDto)}]`,
      events,
    );

    return events;
  }

  public async create(
    user_id: string | undefined,
    eventCreateDto: EventCreateDto,
  ): Promise<EventWithPhotoAndAttachments> {
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

  public async update(
    eventUpdateDto: EventUpdateDto,
  ): Promise<EventWithPhotoAndAttachments> {
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

  public async delete(id: string): Promise<EventWithPhotoAndAttachments> {
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

  private async resetList(): Promise<void> {
    const cache = await this.cacheService.getCache();
    const keys = await cache.store.keys();
    const lists = keys.filter((key) => key.startsWith(`EventService[list]`));

    await Promise.all(lists.map((key) => this.cacheService.del(key)));
  }
}

export type EventWithPhotoAndAttachments = Prisma.EventGetPayload<{
  include: {
    photo: true;
    attachments: true;
  };
}>;
