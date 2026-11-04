import { Injectable } from '@nestjs/common';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

/**
 * Small process-local TTL cache used for read-heavy super-admin aggregates.
 * The API currently runs as a single Node process (or a warm serverless
 * instance), so a dependency-free cache is enough here. Expensive analytics
 * queries are cached briefly and invalidated whenever an audited mutation
 * changes the underlying data.
 */
@Injectable()
export class CacheService {
  private readonly store = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt <= Date.now()) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlMs: number): void {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  async getOrSet<T>(
    key: string,
    ttlMs: number,
    factory: () => Promise<T>,
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== undefined) return cached;

    const value = await factory();
    this.set(key, value, ttlMs);
    return value;
  }

  del(key: string): void {
    this.store.delete(key);
  }

  /** Remove every entry whose key starts with `prefix`. */
  delByPrefix(prefix: string): void {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) this.store.delete(key);
    }
  }

  clear(): void {
    this.store.clear();
  }
}
