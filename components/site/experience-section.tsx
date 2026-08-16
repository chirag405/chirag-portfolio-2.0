"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { Timeline } from "@/components/ui/timeline";
import { InView } from "@/components/motion-primitives/in-view";
import { experiences, type Experience } from "@/lib/data/portfolio";

function ExperienceCard({ exp, onOpen }: { exp: Experience; onOpen: () => void }) {
  const t = useTranslations("experience");
  return (
    <div
      onClick={onOpen}
      data-cursor="expand"
      className="cursor-pointer border p-5 pb-5.5 transition-[transform,border-color,background-color] duration-300 hover:translate-x-1.5"
      style={{ borderColor: "var(--line)", background: "var(--card)" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--accent)";
        e.currentTarget.style.background = "var(--accent-ghost)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--line)";
        e.currentTarget.style.background = "var(--card)";
      }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2 gap-x-4">
        <div className="flex flex-wrap items-baseline gap-2 gap-x-3">
          <span className="font-serif" style={{ fontSize: "clamp(22px,3vw,30px)", lineHeight: 1 }}>
            {exp.title}
          </span>
          <span className="text-xs" style={{ color: "var(--accent)" }}>
            {exp.org}
          </span>
        </div>
        <span className="whitespace-nowrap text-xs text-[color:var(--muted)]">{exp.period}</span>
      </div>
      <p className="mt-2.5 max-w-[66ch] text-[13px] leading-[1.65] text-[color:var(--muted)]">{exp.summary}</p>
      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {exp.stack.map((s) => (
          <span key={s} className="border px-2 py-0.5 text-[10.5px] text-[color:var(--muted)]" style={{ borderColor: "var(--line)" }}>
            {s}
          </span>
        ))}
        <span className="ml-auto text-[11px]" style={{ color: "var(--accent)" }}>
          {t("detailsCta")}
        </span>
      </div>
    </div>
  );
}

export function ExperienceSection() {
  const t = useTranslations("experience");
  const [openId, setOpenId] = useState<string | null>(null);
  const active = experiences.find((e) => e.id === openId) ?? null;

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
          content: <ExperienceCard exp={exp} onOpen={() => setOpenId(exp.id)} />,
        }))}
      />

      <AnimatePresence>
        {active && (
          <motion.div
            onClick={() => setOpenId(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[82] flex items-center justify-center p-6"
            style={{ background: "rgba(10,10,10,.5)", backdropFilter: "blur(3px)" }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="max-h-[86vh] w-[min(560px,94vw)] overflow-y-auto border"
              style={{ borderColor: "var(--line)", background: "var(--card)" }}
            >
              <div
                className="sticky top-0 flex items-center justify-between gap-3 border-b px-5 py-4"
                style={{ borderColor: "var(--line2)", background: "var(--card)" }}
              >
                <span className="text-[11px] text-[color:var(--muted)]">{active.period}</span>
                <button
                  onClick={() => setOpenId(null)}
                  data-cursor="close"
                  className="border-none bg-transparent text-[15px] text-[color:var(--muted)]"
                >
                  ✕
                </button>
              </div>
              <div className="px-6 pb-6.5 pt-5.5">
                <div className="font-serif" style={{ fontSize: "clamp(26px,4vw,38px)", lineHeight: 1.05, letterSpacing: "-0.01em" }}>
                  {active.title}
                </div>
                <div className="mt-1.5 text-[13px]" style={{ color: "var(--accent)" }}>
                  {active.org}
                </div>
                <p className="mt-4.5 text-[13.5px] leading-[1.7] text-[color:var(--muted)]">{active.summary}</p>
                <div className="mb-3 mt-6 text-[11px] uppercase tracking-[0.1em] text-[color:var(--faint)]">
                  {t("whatIDid")}
                </div>
                <div className="flex flex-col gap-2.5">
                  {active.details.map((d, i) => (
                    <div key={i} className="flex gap-2.5 text-[13px] leading-[1.55] text-[color:var(--fg)]">
                      <span className="flex-none" style={{ color: "var(--accent)" }}>
                        →
                      </span>
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5.5 flex flex-wrap gap-1.5 border-t pt-4.5" style={{ borderColor: "var(--line2)" }}>
                  {active.stack.map((s) => (
                    <span key={s} className="border px-2.5 py-1 text-[11px] text-[color:var(--muted)]" style={{ borderColor: "var(--line)" }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </InView>
  );
}
