"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

const HUE_MIN = 20;
const HUE_RANGE = 300;

function applyHue(hue: number) {
  const root = document.documentElement;
  root.style.setProperty("--accent", `oklch(.58 .21 ${hue})`);
  root.style.setProperty("--accent-weak", `oklch(.58 .21 ${hue} / .12)`);
  root.style.setProperty("--accent-ghost", `oklch(.58 .21 ${hue} / .045)`);
}

export function HueLever() {
  const t = useTranslations("header");
  const trackRef = useRef<HTMLDivElement>(null);
  const [knobPct, setKnobPct] = useState(0.55);

  useEffect(() => {
    try {
      const storedHue = localStorage.getItem("chirag-hue");
      if (storedHue) {
        const hue = parseFloat(storedHue);
        if (!Number.isNaN(hue)) {
          // One-shot hydration of the knob position from localStorage on mount, not a derived/cascading update.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setKnobPct(Math.max(0, Math.min(1, (hue - HUE_MIN) / HUE_RANGE)));
        }
      }
    } catch {}
  }, []);

  const setFromClientX = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const hue = Math.round(HUE_MIN + pct * HUE_RANGE);
    setKnobPct(pct);
    applyHue(hue);
    try {
      localStorage.setItem("chirag-hue", String(hue));
    } catch {}
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setFromClientX(e.clientX);
    const move = (ev: PointerEvent) => setFromClientX(ev.clientX);
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const knobLeft = `${(knobPct * 100).toFixed(1)}%`;

  return (
    <div title={t("themeLeverTitle")} className="flex h-5 items-center gap-2">
      <span
        aria-hidden="true"
        className="h-2.5 w-2.5 flex-none rounded-full"
        style={{ background: "var(--accent)" }}
      />
      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        data-cursor="drag"
        className="relative flex h-5 w-24 cursor-ew-resize items-center touch-none"
      >
        <div className="absolute left-0 right-0 h-[2px] rounded-full bg-[color:var(--line)]" />
        <div
          className="absolute left-0 h-[2px] rounded-full transition-[width] duration-75 linear"
          style={{ width: knobLeft, background: "var(--accent)" }}
        />
        <div
          className="absolute h-3 w-3 -translate-x-1/2 rounded-full border border-[color:var(--bg)] transition-[left] duration-75 linear"
          style={{
            left: knobLeft,
            background: "var(--accent)",
            boxShadow: "0 0 0 3px var(--accent-weak)",
          }}
        />
      </div>
    </div>
  );
}
