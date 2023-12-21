"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const ms_1 = __importDefault(require("ms"));
const cache_manager_1 = require("cache-manager");
class CacheService {
    constructor(cache) {
        this.cache = cache;
    }
    static async getInstance() {
        if (!CacheService.instance) {
            const instance = new CacheService(await (0, cache_manager_1.caching)('memory', {
                ttl: (0, ms_1.default)('30s'),
            }));
            CacheService.instance = instance;
        }
        return CacheService.instance;
    }
    async get(key) {
        const item = await this.cache.get(key);
        return item;
    }
    async set(key, value, ttl) {
        const msTtl = ttl ? (0, ms_1.default)(ttl) : void 0;
        await this.cache.set(key, value, msTtl);
    }
    async reset() {
        await this.cache.reset();
    }
    async del(key) {
        await this.cache.del(key);
    }
    async wrap(key, fn, ttl) {
        const msTtl = ttl ? (0, ms_1.default)(ttl) : void 0;
        return await this.cache.wrap(key, fn, msTtl);
    }
    async getCache() {
        return this.cache;
    }
}
exports.CacheService = CacheService;
