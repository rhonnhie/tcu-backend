import ms from 'ms';
import { type Cache, caching } from 'cache-manager';

export class CacheService {
  private static instance: CacheService;

  private constructor(private readonly cache: Cache) {}

  public static async getInstance(): Promise<CacheService> {
    if (!CacheService.instance) {
      const instance = new CacheService(
        await caching('memory', {
          ttl: ms('30s'),
        }),
      );

      CacheService.instance = instance;
    }

    return CacheService.instance;
  }

  public async get<T>(key: string): Promise<T | undefined> {
    const item = await this.cache.get<T>(key);

    return item;
  }

  public async set(key: string, value: unknown, ttl?: string): Promise<void> {
    const msTtl = ttl ? ms(ttl) : void 0;

    await this.cache.set(key, value, msTtl);
  }

  public async reset(): Promise<void> {
    await this.cache.reset();
  }

  public async del(key: string): Promise<void> {
    await this.cache.del(key);
  }

  public async wrap<T>(
    key: string,
    fn: () => Promise<T>,
    ttl?: string,
  ): Promise<T> {
    const msTtl = ttl ? ms(ttl) : void 0;

    return await this.cache.wrap(key, fn, msTtl);
  }

  public async getCache(): Promise<Cache> {
    return this.cache;
  }
}
