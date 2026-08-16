"use client";

import { useTranslations } from "next-intl";
import { InView } from "@/components/motion-primitives/in-view";
import { projects } from "@/lib/data/portfolio";

function ProjectTile({ p }: { p: (typeof projects)[number] }) {
  return (
    <a
      href={p.href}
      data-cursor="open"
      className="flex flex-col gap-3.5 p-3.5 pb-4.5 text-[color:var(--fg)] transition-colors duration-300"
      style={{ background: "var(--card)" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-ghost)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "var(--card)")}
    >
      <div className="relative overflow-hidden border" style={{ aspectRatio: "16/10", borderColor: "var(--line2)", background: "var(--bg)" }}>
        <div className="absolute inset-x-0 top-0 z-10 flex h-[22px] items-center gap-1.5 border-b px-2.5" style={{ background: "var(--card)", borderColor: "var(--line2)" }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--line)" }} />
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--line)" }} />
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--line)" }} />
          <span className="ml-1.5 text-[9.5px] text-[color:var(--faint)]">{p.name.toLowerCase()}.app</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 top-[22px] flex items-center justify-center">
          <span className="font-serif text-4xl opacity-[0.12]">{p.no}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2.5 px-1.5">
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] text-[color:var(--faint)]">{p.no}</span>
          <span className="text-[11px] text-[color:var(--muted)]">{p.kind}</span>
        </div>
        <div className="font-serif text-[26px] leading-none tracking-[-0.01em]">{p.name}</div>
        <div className="text-[12.5px] leading-[1.55] text-[color:var(--muted)]" style={{ minHeight: 40 }}>
          {p.impact}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {p.tags.map((t) => (
            <span key={t} className="border px-1.5 py-0.5 text-[10.5px] text-[color:var(--muted)]" style={{ borderColor: "var(--line)" }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}

export function WorkSection() {
  const t = useTranslations("work");
  return (
    <InView
      as="section"
      id="work"
      once
      variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      viewOptions={{ once: true, amount: 0.1 }}
      className="border-b py-[clamp(48px,8vh,92px)]"
      style={{ borderColor: "var(--line)" }}
    >
      <div className="mb-7.5 flex items-baseline justify-between gap-4">
        <div className="text-[12.5px] uppercase tracking-[0.14em] text-[color:var(--muted)]">{t("eyebrow")}</div>
        <div className="text-[11px] text-[color:var(--faint)]">{t("hint")}</div>
      </div>
      <div className="grid grid-cols-1 gap-px border sm:grid-cols-2 lg:grid-cols-3" style={{ background: "var(--line)", borderColor: "var(--line)" }}>
        {projects.map((p) => (
          <ProjectTile key={p.id} p={p} />
        ))}
      </div>
    </InView>
  );
}
