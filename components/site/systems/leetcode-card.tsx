"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Donut } from "./viz";
import type { LeetcodeStats } from "@/lib/leetcode";

export function LeetcodeCard() {
  const t = useTranslations("systems");
  const [stats, setStats] = useState<LeetcodeStats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/leetcode")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col border" style={{ borderColor: "var(--line)", background: "var(--card)" }}>
      <div className="flex items-center justify-between border-b px-4.5 py-3.5" style={{ borderColor: "var(--line2)" }}>
        <div className="text-[12.5px]">
          <span className="text-[color:var(--muted)]">leetcode/</span>
          <span className="font-medium">chirag405</span>
        </div>
        <a href="https://leetcode.com/chirag405" target="_blank" rel="noopener noreferrer" data-cursor="open" className="text-[11.5px] text-[color:var(--muted)]">
          {t("leetcodeOpen")} ↗
        </a>
      </div>
      {error || !stats ? (
        <div className="flex-1 p-4.5 py-6 text-center text-[12px] text-[color:var(--faint)]">
          {error ? t("leetcodeUnavailable") : <div className="h-24 animate-pulse" style={{ background: "var(--line2)" }} />}
        </div>
      ) : (
        <div className="flex items-center gap-5 p-4.5">
          <Donut easy={stats.easy} medium={stats.medium} hard={stats.hard} />
          <div className="flex min-w-0 flex-1 flex-col gap-2.5">
            <Row label={t("easy")} value={stats.easy} color="oklch(.72 .15 165)" />
            <Row label={t("medium")} value={stats.medium} color="oklch(.75 .15 75)" />
            <Row label={t("hard")} value={stats.hard} color="oklch(.62 .21 25)" />
            <div className="my-0.5 h-px" style={{ background: "var(--line2)" }} />
            <Row label={t("lcStreak")} value={`${stats.streak}d`} color="var(--muted)" />
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div className="flex items-center justify-between gap-2 text-xs">
      <span style={{ color }}>{label}</span>
      <span>{value}</span>
    </div>
  );
}
