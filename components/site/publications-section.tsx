"use client";

import { useTranslations } from "next-intl";
import { InView } from "@/components/motion-primitives/in-view";
import { publication } from "@/lib/data/portfolio";

export function PublicationsSection() {
  const t = useTranslations("publications");
  return (
    <InView
      as="section"
      once
      variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      viewOptions={{ once: true, amount: 0.2 }}
      className="border-b py-[clamp(48px,8vh,92px)]"
      style={{ borderColor: "var(--line)" }}
    >
      <div className="mb-7.5 text-[12.5px] uppercase tracking-[0.14em] text-[color:var(--muted)]">{t("eyebrow")}</div>
      <div className="grid max-w-[920px] grid-cols-[34px_1fr] gap-x-[clamp(16px,4vw,40px)]">
        <div className="font-serif text-[30px] leading-none" style={{ color: "var(--accent)" }}>
          [1]
        </div>
        <div className="border-l pl-[clamp(16px,3vw,32px)]" style={{ borderColor: "var(--line)" }}>
          <p className="m-0 font-serif" style={{ fontSize: "clamp(20px,2.4vw,27px)", lineHeight: 1.32 }}>
            {publication.title}
          </p>
          <p className="mt-3.5 text-[13px] leading-[1.7] text-[color:var(--muted)]">
            {publication.authors} <span className="text-[color:var(--faint)]">et al.</span> ·{" "}
            <span className="italic">{publication.venue}</span> · {publication.volume} · {publication.date}.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-5.5 gap-y-2 text-xs text-[color:var(--muted)]">
            <span>
              {t("impactFactor")} <span className="text-[color:var(--fg)]">{publication.impactFactor}</span>
            </span>
            <span>
              ISSN <span className="text-[color:var(--fg)]">{publication.issn}</span>
            </span>
            <a href="#publication" style={{ color: "var(--accent)" }}>
              {t("viewPaper")} <span className="text-[color:var(--faint)]">{"// add link"}</span>
            </a>
          </div>
        </div>
      </div>
    </InView>
  );
}
