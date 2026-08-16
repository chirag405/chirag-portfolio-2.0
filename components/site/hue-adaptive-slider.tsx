"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { AdaptiveSlider, type ColorSettings } from "@/components/ui/adaptive-slider";

const HUE_MIN = 20;
const HUE_MAX = 320;
const DEFAULT_HUE = 258;

function applyHue(hue: number) {
  const root = document.documentElement;
  root.style.setProperty("--accent", `oklch(.58 .21 ${hue})`);
  root.style.setProperty("--accent-weak", `oklch(.58 .21 ${hue} / .12)`);
  root.style.setProperty("--accent-ghost", `oklch(.58 .21 ${hue} / .045)`);
}

function rainbowTrack(min: number, max: number) {
  const stops = 8;
  const colors = Array.from({ length: stops }, (_, i) => {
    const hue = min + (i / (stops - 1)) * (max - min);
    return `oklch(.68 .17 ${hue})`;
  });
  return `linear-gradient(to right, ${colors.join(",")})`;
}

const hueColor = (value: number): ColorSettings => ({
  text: `oklch(.55 .21 ${value})`,
  gradient: "",
});

export function HueAdaptiveSlider() {
  const t = useTranslations("header");
  const [open, setOpen] = useState(false);
  const [hue, setHue] = useState(DEFAULT_HUE);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("chirag-hue");
      if (stored) {
        const n = parseFloat(stored);
        // One-shot hydration from localStorage on mount, not a derived/cascading update.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (!Number.isNaN(n)) setHue(n);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const onChange = (value: number) => {
    setHue(value);
    applyHue(value);
    try {
      localStorage.setItem("chirag-hue", String(value));
    } catch {}
  };

  return (
    <div ref={wrapRef} className="relative flex items-center">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title={t("themeLeverTitle")}
        data-cursor="drag"
        className="flex h-5 w-5 items-center justify-center rounded-full border"
        style={{ borderColor: "var(--line)" }}
      >
        <span
          aria-hidden="true"
          className="h-2.5 w-2.5 rounded-full"
          style={{ background: "var(--accent)" }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-[calc(100%+10px)] z-[70]"
          >
            <AdaptiveSlider
              value={hue}
              min={HUE_MIN}
              max={HUE_MAX}
              step={1}
              label={t("hueLabel")}
              unit="°"
              formatValue={(v) => String(Math.round(v))}
              getColor={hueColor}
              trackBackground={rainbowTrack(HUE_MIN, HUE_MAX)}
              onChange={onChange}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
