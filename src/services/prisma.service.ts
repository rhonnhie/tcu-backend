import { PrismaClient } from '@prisma/client';

export class PrismaService {
  private static instance: PrismaService;
  private static prismaClient: PrismaClient;

  private constructor() {}

  public static async getInstance(): Promise<PrismaService> {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaService();
    }

    return PrismaService.instance;
  }

  public async getClient(): Promise<PrismaClient> {
    if (!PrismaService.prismaClient) {
      PrismaService.prismaClient = new PrismaClient();
      await PrismaService.prismaClient.$connect();
    }

    return PrismaService.prismaClient;
  }

  public async disconnect(): Promise<void> {
    const prismaClient = await this.getClient();

    await prismaClient.$disconnect();
  }
}
