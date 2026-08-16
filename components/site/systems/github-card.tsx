"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatedNumber } from "@/components/motion-primitives/animated-number";
import { LangBar, ContribGrid } from "./viz";
import type { GithubStats } from "@/lib/github";

export function GithubCard() {
  const t = useTranslations("systems");
  const [stats, setStats] = useState<GithubStats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/github")
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
    <div className="col-span-full border" style={{ borderColor: "var(--line)", background: "var(--card)" }}>
      <div className="flex items-center justify-between gap-3 border-b px-4.5 py-3.5" style={{ borderColor: "var(--line2)" }}>
        <div className="flex items-center gap-2.5 text-[12.5px]">
          <span className="text-[color:var(--muted)]">github.com/</span>
          <span className="font-medium">chirag405</span>
        </div>
        <a href="https://github.com/chirag405" target="_blank" rel="noopener noreferrer" data-cursor="open" className="text-[11.5px] text-[color:var(--muted)]">
          {t("githubOpen")} ↗
        </a>
      </div>
      <div className="p-4.5">
        {error ? (
          <div className="py-6 text-center text-[12px] text-[color:var(--faint)]">{t("githubUnavailable")}</div>
        ) : (
          <>
            <div className="mb-5 flex flex-wrap gap-x-10 gap-y-6">
              <Stat value={stats?.contributions} label={t("contribs")} fallback="—" />
              <Stat value={stats?.repos} label={t("repos")} />
              <Stat value={stats?.stars} label={t("stars")} />
              <Stat value={stats?.streak} label={t("streak")} fallback="—" />
            </div>
            <div style={{ minHeight: 104 }}>
              {stats ? (
                <ContribGrid calendar={stats.calendar} />
              ) : (
                <div className="h-24 animate-pulse" style={{ background: "var(--line2)" }} />
              )}
              {stats && !stats.calendar && (
                <div className="mt-1.5 text-[10px] text-[color:var(--faint)]">{t("contribsUnavailable")}</div>
              )}
            </div>
            <div className="mt-5.5 grid grid-cols-1 gap-6.5 sm:grid-cols-2">
              <div>
                <div className="mb-2.5 text-[11px] text-[color:var(--muted)]">{t("topLanguages")}</div>
                {stats ? <LangBar languages={stats.languages} /> : null}
              </div>
              <div>
                <div className="mb-2.5 text-[11px] text-[color:var(--muted)]">{t("recentCommits")}</div>
                <div className="flex flex-col gap-2">
                  {stats?.commits.map((c) => (
                    <div key={c.hash} className="flex gap-2.5 text-xs leading-[1.35]">
                      <span className="flex-none" style={{ color: "var(--accent)" }}>
                        {c.hash}
                      </span>
                      <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[color:var(--fg)]">
                        {c.msg}
                      </span>
                      <span className="ml-auto flex-none text-[color:var(--faint)]">{c.when}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Stat({ value, label, fallback }: { value: number | null | undefined; label: string; fallback?: string }) {
  if (value === null && fallback) {
    return (
      <div>
        <div className="font-serif text-[26px]">{fallback}</div>
        <div className="mt-0.5 text-[11px] text-[color:var(--muted)]">{label}</div>
      </div>
    );
  }
  return (
    <div>
      <AnimatedNumber value={value ?? 0} className="font-serif text-[26px]" />
      <div className="mt-0.5 text-[11px] text-[color:var(--muted)]">{label}</div>
    </div>
  );
}
