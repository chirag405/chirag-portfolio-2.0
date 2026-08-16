// Best-effort, in-memory, single-instance rate limiter — fine for a personal
// portfolio behind one Node process; not a substitute for a shared store
// (Redis/KV) if this is ever deployed across multiple serverless instances.
const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 30;

const hits = new Map<string, number[]>();

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const existing = (hits.get(key) ?? []).filter((t) => t > windowStart);
  existing.push(now);
  hits.set(key, existing);
  return existing.length > MAX_REQUESTS_PER_WINDOW;
}
