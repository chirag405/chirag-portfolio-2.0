"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const HUE_MIN = 20;
const HUE_MAX = 320;
const DEFAULT_HUE = 258;

function applyHue(hue: number) {
  const root = document.documentElement;
  root.style.setProperty("--accent", `oklch(.58 .21 ${hue})`);
  root.style.setProperty("--accent-weak", `oklch(.58 .21 ${hue} / .12)`);
  root.style.setProperty("--accent-ghost", `oklch(.58 .21 ${hue} / .045)`);
}

export function HueAdaptiveSlider() {
  const t = useTranslations("header");
  const [hue, setHue] = useState(DEFAULT_HUE);

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

  const onChange = (value: number) => {
    setHue(value);
    applyHue(value);
    try {
      localStorage.setItem("chirag-hue", String(value));
    } catch {}
  };

  const pct = ((hue - HUE_MIN) / (HUE_MAX - HUE_MIN)) * 100;

  return (
    <div title={t("themeLeverTitle")} className="flex items-center gap-2">
      <span aria-hidden="true" className="h-2.5 w-2.5 flex-none rounded-full" style={{ background: "var(--accent)" }} />
      <input
        type="range"
        min={HUE_MIN}
        max={HUE_MAX}
        step={1}
        value={hue}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={t("hueLabel")}
        data-cursor="drag"
        className={[
          "h-1 w-24 cursor-pointer appearance-none rounded-full",
          "[&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:rounded-full",
          "[&::-moz-range-track]:h-1 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-[color:var(--line)]",
          "[&::-webkit-slider-thumb]:mt-[-4px] [&::-webkit-slider-thumb]:h-[10px] [&::-webkit-slider-thumb]:w-[10px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--accent)] [&::-webkit-slider-thumb]:shadow-[0_0_0_3px_var(--accent-weak)]",
          "[&::-moz-range-thumb]:h-[10px] [&::-moz-range-thumb]:w-[10px] [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-[var(--accent)] [&::-moz-range-thumb]:shadow-[0_0_0_3px_var(--accent-weak)]",
        ].join(" ")}
        style={{
          background: `linear-gradient(to right, var(--accent) ${pct}%, var(--line) ${pct}%)`,
        }}
      />
    </div>
  );
}
