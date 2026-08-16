"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatedNumber } from "@/components/motion-primitives/animated-number";
import { Spark } from "./viz";
import type { UsageSummary } from "@/lib/usage-store";

const POLL_MS = 8000;

function formatTokens(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "k";
  return String(Math.round(n));
}

export function ObservabilityCard() {
  const t = useTranslations("systems");
  const [stats, setStats] = useState<UsageSummary | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      fetch("/api/stats")
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((data) => {
          if (!cancelled) setStats(data);
        })
        .catch(() => {});
    };
    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const updatedSeconds = stats ? Math.max(0, Math.round(stats.updatedAgoMs / 1000)) : 0;
  const hasTraffic = (stats?.apiCalls24h ?? 0) > 0;

  return (
    <div className="relative overflow-hidden border" style={{ borderColor: "var(--line)", background: "var(--card)" }}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(var(--accent-ghost) 1px,transparent 1px),linear-gradient(90deg,var(--accent-ghost) 1px,transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
      <div className="relative flex items-center justify-between gap-3 border-b px-4.5 py-3.5" style={{ borderColor: "var(--line2)" }}>
        <div className="text-[12.5px]">
          <span className="text-[color:var(--muted)]">svc/</span>
          <span className="font-medium">genai-support-bot</span>
        </div>
        <span className="flex items-center gap-1.5 text-[11px]" style={{ color: "oklch(.72 .15 165)" }}>
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: "oklch(.72 .15 165)", animation: "pulse 2.4s ease-in-out infinite" }}
          />
          {t("healthy")}
        </span>
      </div>
      <div className="relative p-4.5">
        <div className="grid grid-cols-2 gap-x-3.5 gap-y-4">
          <Metric value={formatTokens(stats?.tokensProcessed24h ?? 0)} label={t("tokensProcessed")} />
          <Metric numeric={stats?.apiCalls24h} label={t("apiCalls")} />
          <Metric value={`$${(stats?.costPerQuery ?? 0).toFixed(4)}`} label={t("costPerQuery")} />
          <Metric value={`${stats?.p95LatencyMs ?? 0}`} suffix="ms" label={t("p95Latency")} />
        </div>
        <div className="mt-4">
          <div className="mb-1.5 flex justify-between text-[10.5px] text-[color:var(--muted)]">
            <span>{t("throughput")}</span>
            <span>{stats ? t("updated", { seconds: updatedSeconds }) : ""}</span>
          </div>
          {hasTraffic ? (
            <Spark data={stats?.throughputSpark ?? []} />
          ) : (
            <div className="flex h-9 items-center text-[10.5px] text-[color:var(--faint)]">{t("noTraffic")}</div>
          )}
        </div>
      </div>
    </div>
  );
}

function Metric({
  value,
  numeric,
  suffix,
  label,
}: {
  value?: string;
  numeric?: number;
  suffix?: string;
  label: string;
}) {
  return (
    <div>
      <div className="text-[22px] tracking-[-0.01em]">
        {numeric !== undefined ? (
          <AnimatedNumber value={numeric} />
        ) : (
          value
        )}
        {suffix && <span className="text-xs text-[color:var(--muted)]">{suffix}</span>}
      </div>
      <div className="mt-0.5 text-[10.5px] text-[color:var(--muted)]">{label}</div>
    </div>
  );
}
