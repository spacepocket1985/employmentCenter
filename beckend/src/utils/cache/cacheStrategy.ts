
export class Cache<T> {
  private cache: Map<string, { data: T; timestamp: number }>;
  private prefix: string;
  private ttl: number; // секунды

  constructor(prefix: string = 'cache', ttlSeconds: number = 300) {
    this.cache = new Map();
    this.prefix = prefix;
    this.ttl = ttlSeconds;
  }

  private getKey(key: string): string {
    return `${this.prefix}:${key}`;
  }

  /**
   * Получить данные из кэша (синхронно)
   */
  get(key: string): T | null {
    const cacheKey = this.getKey(key);
    const item = this.cache.get(cacheKey);
    
    if (!item) return null;

    // Проверяем, не истек ли срок
    if (Date.now() - item.timestamp > this.ttl * 1000) {
      this.cache.delete(cacheKey);
      return null;
    }

    return item.data;
  }

  /**
   * Сохранить данные в кэш
   */
  set(key: string, data: T): void {
    const cacheKey = this.getKey(key);
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Удалить данные из кэша
   */
  delete(key: string): void {
    this.cache.delete(this.getKey(key));
  }

  /**
   * Очистить все данные с префиксом
   */
  clear(): void {
    const prefix = `${this.prefix}:`;
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Получить все ключи
   */
  keys(): string[] {
    const prefix = `${this.prefix}:`;
    return Array.from(this.cache.keys()).filter(key => key.startsWith(prefix));
  }
}