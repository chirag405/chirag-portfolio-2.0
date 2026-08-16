"use client";

import { useTranslations } from "next-intl";
import { InView } from "@/components/motion-primitives/in-view";
import { skills } from "@/lib/data/portfolio";

export function StackSection() {
  const t = useTranslations("stack");
  return (
    <InView
      as="section"
      id="stack"
      once
      variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      viewOptions={{ once: true, amount: 0.2 }}
      className="border-b py-[clamp(48px,8vh,92px)]"
      style={{ borderColor: "var(--line)" }}
    >
      <div className="mb-9 text-[12.5px] uppercase tracking-[0.14em] text-[color:var(--muted)]">{t("eyebrow")}</div>
      <div className="grid gap-x-10 gap-y-8.5" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))" }}>
        {skills.map((g) => (
          <div key={g.cat}>
            <div className="mb-3.5 text-xs" style={{ color: "var(--accent)" }}>
              {g.cat}
            </div>
            <div className="flex flex-col gap-2.5">
              {g.items.map((s) => (
                <div key={s} className="flex items-center gap-2.5 text-[13px] text-[color:var(--fg)]">
                  <span className="h-1 w-1 flex-none" style={{ background: "var(--line)" }} />
                  {s}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </InView>
  );
}
