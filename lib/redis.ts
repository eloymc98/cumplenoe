import { Redis } from "@upstash/redis";

/**
 * Subconjunto de operaciones Redis que usa la app. Tanto el cliente real de
 * Upstash como el mock en memoria cumplen esta interfaz, de modo que el resto
 * del código es agnóstico al backend.
 */
export interface DB {
  get<T = unknown>(key: string): Promise<T | null>;
  set(key: string, value: unknown): Promise<unknown>;
  del(...keys: string[]): Promise<number>;
  sadd(key: string, ...members: string[]): Promise<number>;
  srem(key: string, ...members: string[]): Promise<number>;
  smembers(key: string): Promise<string[]>;
  zadd(key: string, entry: { score: number; member: string }): Promise<number | null>;
  zscore(key: string, member: string): Promise<number | null>;
  zrange(
    key: string,
    start: number,
    stop: number,
    opts: { rev?: boolean; withScores?: boolean },
  ): Promise<(string | number)[]>;
}

function hasUpstashEnv(): boolean {
  return Boolean(
    (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) ||
      (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN),
  );
}

function createUpstash(): DB {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL ?? "";
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN ?? "";
  return new Redis({ url, token }) as unknown as DB;
}

// --- Mock en memoria (solo desarrollo, no persiste entre reinicios) ---

interface MemStore {
  kv: Map<string, unknown>;
  sets: Map<string, Set<string>>;
  zsets: Map<string, Map<string, number>>;
}

// Persistimos el store en globalThis para sobrevivir al hot-reload de Next.
const globalForMock = globalThis as unknown as { __cumpleMock?: MemStore };
function memStore(): MemStore {
  if (!globalForMock.__cumpleMock) {
    globalForMock.__cumpleMock = {
      kv: new Map(),
      sets: new Map(),
      zsets: new Map(),
    };
  }
  return globalForMock.__cumpleMock;
}

function createMock(): DB {
  const s = memStore();
  return {
    async get<T>(key: string) {
      return (s.kv.has(key) ? (s.kv.get(key) as T) : null) as T | null;
    },
    async set(key, value) {
      s.kv.set(key, value);
      return "OK";
    },
    async del(...keys) {
      let n = 0;
      for (const k of keys) {
        if (s.kv.delete(k)) n++;
        s.sets.delete(k);
        s.zsets.delete(k);
      }
      return n;
    },
    async sadd(key, ...members) {
      const set = s.sets.get(key) ?? new Set<string>();
      let added = 0;
      for (const m of members) {
        if (!set.has(m)) {
          set.add(m);
          added++;
        }
      }
      s.sets.set(key, set);
      return added;
    },
    async srem(key, ...members) {
      const set = s.sets.get(key);
      if (!set) return 0;
      let n = 0;
      for (const m of members) if (set.delete(m)) n++;
      return n;
    },
    async smembers(key) {
      return Array.from(s.sets.get(key) ?? []);
    },
    async zadd(key, { score, member }) {
      const z = s.zsets.get(key) ?? new Map<string, number>();
      const existed = z.has(member);
      z.set(member, score);
      s.zsets.set(key, z);
      return existed ? 0 : 1;
    },
    async zscore(key, member) {
      const z = s.zsets.get(key);
      const v = z?.get(member);
      return v === undefined ? null : v;
    },
    async zrange(key, start, stop, opts) {
      const z = s.zsets.get(key);
      if (!z) return [];
      let entries = Array.from(z.entries());
      entries.sort((a, b) => (opts.rev ? b[1] - a[1] : a[1] - b[1]));
      const end = stop === -1 ? entries.length : stop + 1;
      entries = entries.slice(start, end);
      const out: (string | number)[] = [];
      for (const [member, score] of entries) {
        out.push(member);
        if (opts.withScores) out.push(score);
      }
      return out;
    },
  };
}

let _db: DB | null = null;

export function getDB(): DB {
  if (_db) return _db;
  _db = hasUpstashEnv() ? createUpstash() : createMock();
  return _db;
}

export const usingMockDB = !hasUpstashEnv();
