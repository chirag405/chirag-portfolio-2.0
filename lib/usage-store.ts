import { promises as fs } from "fs";
import path from "path";

export type UsageRecord = {
  ts: number;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  latencyMs: number;
  costUsd: number;
};

// Claude Sonnet 5 introductory pricing (through 2026-08-31): $2.00 / $10.00 per MTok.
// Update to $3.00 / $15.00 after the intro window closes.
const INPUT_PRICE_PER_MTOK = 2.0;
const OUTPUT_PRICE_PER_MTOK = 10.0;

export function computeCostUsd(inputTokens: number, outputTokens: number): number {
  return (
    (inputTokens / 1_000_000) * INPUT_PRICE_PER_MTOK +
    (outputTokens / 1_000_000) * OUTPUT_PRICE_PER_MTOK
  );
}

const MAX_RECORDS = 2000;
const records: UsageRecord[] = [];

const DATA_DIR = path.join(process.cwd(), ".data");
const LOG_FILE = path.join(DATA_DIR, "usage-log.jsonl");
let hydrated = false;

async function hydrateFromDisk() {
  if (hydrated) return;
  hydrated = true;
  try {
    const raw = await fs.readFile(LOG_FILE, "utf8");
    const lines = raw.trim().split("\n").filter(Boolean);
    for (const line of lines.slice(-MAX_RECORDS)) {
      try {
        records.push(JSON.parse(line));
      } catch {}
    }
  } catch {
    // No log file yet, or filesystem is read-only (serverless) — in-memory only.
  }
}

async function appendToDisk(record: UsageRecord) {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.appendFile(LOG_FILE, JSON.stringify(record) + "\n", "utf8");
  } catch {
    // Best-effort only — read-only filesystems (e.g. some serverless hosts) just keep in-memory history.
  }
}

export async function recordUsage(record: UsageRecord) {
  await hydrateFromDisk();
  records.push(record);
  if (records.length > MAX_RECORDS) records.splice(0, records.length - MAX_RECORDS);
  void appendToDisk(record);
}

export type UsageSummary = {
  tokensProcessed24h: number;
  apiCalls24h: number;
  costPerQuery: number;
  p95LatencyMs: number;
  throughputSpark: number[];
  updatedAgoMs: number;
  healthy: boolean;
};

export async function getUsageSummary(): Promise<UsageSummary> {
  await hydrateFromDisk();
  const now = Date.now();
  const dayAgo = now - 24 * 60 * 60 * 1000;
  const recent = records.filter((r) => r.ts >= dayAgo);

  const tokensProcessed24h = recent.reduce(
    (sum, r) => sum + r.inputTokens + r.outputTokens,
    0
  );
  const apiCalls24h = recent.length;
  const totalCost = recent.reduce((sum, r) => sum + r.costUsd, 0);
  const costPerQuery = apiCalls24h > 0 ? totalCost / apiCalls24h : 0;

  const latencies = recent.map((r) => r.latencyMs).sort((a, b) => a - b);
  const p95Index = Math.min(latencies.length - 1, Math.floor(latencies.length * 0.95));
  const p95LatencyMs = latencies.length > 0 ? latencies[p95Index] : 0;

  // 24 hourly buckets of tokens/sec throughput for the sparkline.
  const buckets: number[] = new Array(24).fill(0);
  const bucketDurations: number[] = new Array(24).fill(0);
  for (const r of recent) {
    const hoursAgo = Math.floor((now - r.ts) / (60 * 60 * 1000));
    const idx = 23 - Math.min(23, hoursAgo);
    buckets[idx] += r.inputTokens + r.outputTokens;
    bucketDurations[idx] += Math.max(r.latencyMs, 1) / 1000;
  }
  const throughputSpark = buckets.map((tok, i) =>
    bucketDurations[i] > 0 ? Math.round(tok / bucketDurations[i]) : 0
  );

  const lastTs = records.length > 0 ? records[records.length - 1].ts : now;

  return {
    tokensProcessed24h,
    apiCalls24h,
    costPerQuery,
    p95LatencyMs,
    throughputSpark,
    updatedAgoMs: now - lastTs,
    healthy: true,
  };
}
