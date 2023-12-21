import { type Prisma } from '@prisma/client';
import { QuestionCreateDto } from '../dtos/question-create.dto';
import { CacheService } from './cache.service';
import { PrismaService } from './prisma.service';
import { QuestionUpdateDto } from '../dtos/question-update.dto';
import { QuestionListDto } from '../dtos/question-list.dto';
import { vendors } from '@jmrl23/express-helper';

export class QuestionService {
  private static instance: QuestionService;

  private constructor(
    private readonly prismaService: PrismaService,
    private readonly cacheService: CacheService,
  ) {}

  public static async getInstance(): Promise<QuestionService> {
    if (!QuestionService.instance) {
      const instance = new QuestionService(
        await PrismaService.getInstance(),
        await CacheService.getInstance(),
      );

      QuestionService.instance = instance;
    }

    return QuestionService.instance;
  }

  public async getById(
    id: string,
  ): Promise<Question | null> {
    const prismaClient = await this.prismaService.getClient();
    const question = await prismaClient.question.findUnique({
      where: {
        id,
      },
    });

    if (!question) {
      throw new vendors.httpErrors.NotFound('question not found');
    }

    await this.cacheService.set(
      `QuestionService[question][${question.id}]`,
      question,
    );

    return question;
  }

  public async list(
    questionListDto: QuestionListDto,
  ): Promise<Question[]> {
    const cachedList = await this.cacheService.get<
      Question[]
    >(`QuestionService[list][${JSON.stringify(questionListDto)}]`);

    if (cachedList) return cachedList;

    const prismaClient = await this.prismaService.getClient();
    const questions = await prismaClient.question.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });

    await this.cacheService.set(
      `QuestionService[list][${JSON.stringify(questionListDto)}]`,
      questions,
    );

    return questions;
  }

  public async create(
    userId: string | undefined,
    questionCreateDto: QuestionCreateDto,
  ): Promise<Question> {
    const prismaClient = await this.prismaService.getClient();
    const question = await prismaClient.question.create({
      data: {
        question: questionCreateDto.question,
        answer: questionCreateDto.answer,
      },
    });

    await this.cacheService.set(
      `QuestionService[question][${question.id}]`,
      question,
    );
    await this.resetList();

    return question;
  }

  public async update(
    questionUpdateDto: QuestionUpdateDto,
  ): Promise<Question> {
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

    await this.cacheService.set(
      `QuestionService[question][${question.id}]`,
      question,
    );
    await this.resetList();

    return question;
  }

  public async delete(
    id: string,
  ): Promise<Question> {
    const prismaClient = await this.prismaService.getClient();
    const question = await prismaClient.question.delete({
      where: {
        id,
      },
    });

    await this.cacheService.del(
      `QuestionService[question][${question.id}]`,
    );
    await this.resetList();

    return question;
  }

  private async resetList(): Promise<void> {
    const cache = await this.cacheService.getCache();
    const keys = await cache.store.keys();
    const lists = keys.filter((key) =>
      key.startsWith(`QuestionService[list]`),
    );

    await Promise.all(lists.map((key) => this.cacheService.del(key)));
  }
}

export type Question = Prisma.QuestionGetPayload<{}>;