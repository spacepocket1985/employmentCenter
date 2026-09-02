import { Cache } from './cacheStrategy';

export type TCacheConfig = {
  ttlSeconds: number;
  prefix: string;
};

export class CacheManager {
  private caches: Map<string, Cache<unknown>> = new Map();

  register<T>(entityName: string, config: TCacheConfig): Cache<T> {
    if (this.caches.has(entityName)) {
      return this.caches.get(entityName) as Cache<T>;
    }

    const cache = new Cache<T>(config.prefix, config.ttlSeconds);
    this.caches.set(entityName, cache);
    console.log(`✅ Кэш зарегистрирован для: ${entityName}`);
    return cache;
  }

  get<T>(entityName: string): Cache<T> | null {
    return (this.caches.get(entityName) as Cache<T>) || null;
  }

  clearEntity(entityName: string): void {
    const cache = this.caches.get(entityName);
    if (cache) {
      cache.clear();
      console.log(`🗑️ Кэш очищен для: ${entityName}`);
    }
  }

  clearAll(): void {
    for (const [name, cache] of this.caches) {
      cache.clear();
      console.log(`🗑️ Кэш очищен для: ${name}`);
    }
  }
}

export const cacheManager = new CacheManager();
