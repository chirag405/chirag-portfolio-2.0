"use client";

import { useTranslations } from "next-intl";
import { InView } from "@/components/motion-primitives/in-view";
import {
  ImageComparison,
  ImageComparisonImage,
  ImageComparisonSlider,
} from "@/components/motion-primitives/image-comparison";

export function ThemePreviewSection() {
  const t = useTranslations("preview");
  return (
    <InView
      as="div"
      once
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      viewOptions={{ once: true, amount: 0.15 }}
      // Full-bleed breakout: the page shell is a centered max-w-[1240px]
      // container, but this panel needs to fill the actual viewport edge
      // to edge and top to bottom, not sit inside a bordered "section" card.
      className="relative left-1/2 -mx-[50vw] w-screen"
    >
      <ImageComparison className="h-[100dvh] w-full select-none">
        <ImageComparisonImage src="/preview-light.png" alt="Portfolio in light mode" position="left" />
        <ImageComparisonImage src="/preview-dark.png" alt="Portfolio in dark mode" position="right" />
        <ImageComparisonSlider className="w-[2px] bg-[color:var(--accent)]">
          <div
            className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border"
            style={{ background: "var(--card)", borderColor: "var(--accent)", boxShadow: "0 4px 16px -6px rgba(10,10,10,.35)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round">
              <path d="M8 6 3 12l5 6M16 6l5 6-5 6" />
            </svg>
          </div>
        </ImageComparisonSlider>
        <div
          className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 border px-3 py-1.5 text-[11px] uppercase tracking-[0.14em]"
          style={{ background: "color-mix(in oklab, var(--card) 82%, transparent)", borderColor: "var(--line)", color: "var(--muted)", backdropFilter: "blur(6px)" }}
        >
          {t("hint")}
        </div>
      </ImageComparison>
    </InView>
  );
}
