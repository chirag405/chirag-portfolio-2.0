"use client";

import { useTranslations } from "next-intl";
import { Timeline } from "@/components/ui/timeline";
import { InView } from "@/components/motion-primitives/in-view";
import { experiences, type Experience } from "@/lib/data/portfolio";

function ExperienceCard({ exp }: { exp: Experience }) {
  const t = useTranslations("experience");
  return (
    <div
      className="border p-5.5 transition-[border-color,background-color] duration-300 sm:p-7"
      style={{ borderColor: "var(--line)", background: "var(--card)" }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2 gap-x-4">
        <div className="flex flex-wrap items-baseline gap-2 gap-x-3">
          {exp.logo && (
            <span
              className="inline-flex h-7 w-7 flex-none translate-y-0.5 items-center justify-center rounded-md p-1"
              style={{ background: "#fbfbfb" }}
            >
              <img src={exp.logo} alt="" className="h-full w-full object-contain" />
            </span>
          )}
          <span className="font-serif" style={{ fontSize: "clamp(24px,3.4vw,34px)", lineHeight: 1 }}>
            {exp.title}
          </span>
          <span className="text-xs" style={{ color: "var(--accent)" }}>
            {exp.org}
          </span>
        </div>
        <span className="whitespace-nowrap text-xs text-[color:var(--muted)]">{exp.period}</span>
      </div>
      <p className="mt-3 max-w-[68ch] text-[13.5px] leading-[1.7] text-[color:var(--muted)]">{exp.summary}</p>

      <div className="mb-3 mt-6 text-[11px] uppercase tracking-[0.1em] text-[color:var(--faint)]">
        {t("whatIDid")}
      </div>
      <div className="flex flex-col gap-2.5">
        {exp.details.map((d, i) => (
          <div key={i} className="flex gap-2.5 text-[13px] leading-[1.55] text-[color:var(--fg)]">
            <span className="flex-none" style={{ color: "var(--accent)" }}>
              →
            </span>
            <span>{d}</span>
          </div>
        ))}
      </div>

      <div className="mt-5.5 flex flex-wrap gap-1.5 border-t pt-4.5" style={{ borderColor: "var(--line2)" }}>
        {exp.stack.map((s) => (
          <span key={s} className="border px-2.5 py-1 text-[11px] text-[color:var(--muted)]" style={{ borderColor: "var(--line)" }}>
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ExperienceSection() {
  const t = useTranslations("experience");

  return (
    <InView
      as="section"
      id="experience"
      once
      variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="border-b py-[clamp(48px,8vh,92px)]"
      style={{ borderColor: "var(--line)" }}
      viewOptions={{ once: true, amount: 0.14 }}
    >
      <div className="mb-9.5 flex items-baseline justify-between gap-4">
        <div className="text-[12.5px] uppercase tracking-[0.14em] text-[color:var(--muted)]">{t("eyebrow")}</div>
        <div className="text-[11px] text-[color:var(--faint)]">{t("hint")}</div>
      </div>
      <Timeline
        data={experiences.map((exp) => ({
          title: exp.period,
          content: <ExperienceCard exp={exp} />,
        }))}
      />
    </InView>
  );
}
