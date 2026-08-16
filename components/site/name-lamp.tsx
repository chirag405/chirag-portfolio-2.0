"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

function useIsDark() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.getAttribute("data-theme") === "dark");
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);
  return isDark;
}

/**
 * Retheme of Aceternity's Lamp (https://ui.aceternity.com) — the original
 * is a full-viewport `min-h-screen` hero centerpiece in fixed slate-950/
 * cyan colors. Ported down into a small decorative layer that sits behind
 * the hero name (not a full section), recolored to --accent/--bg so it
 * follows the hue lever, and gated to dark mode only — the glow effect
 * only reads right against a near-black background.
 */
export function NameLamp() {
  const isDark = useIsDark();
  const prefersReducedMotion = useReducedMotion();

  if (!isDark) return null;

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -top-1 left-0 z-0 h-20 w-full max-w-[560px] overflow-visible sm:top-0 sm:h-28"
    >
      <div className="relative flex h-full w-full items-start justify-center">
        {/* left beam */}
        <motion.div
          initial={{ opacity: 0.4, width: "7rem" }}
          animate={{ opacity: 1, width: "14rem" }}
          transition={transition}
          style={{ backgroundImage: `conic-gradient(from 70deg at center top, var(--accent), transparent 60%)` }}
          className="absolute inset-auto right-1/2 h-full w-56 text-transparent"
        >
          <div
            className="absolute bottom-0 left-0 h-2/3 w-full [mask-image:linear-gradient(to_top,white,transparent)]"
            style={{ background: "var(--bg)" }}
          />
          <div
            className="absolute bottom-0 left-0 h-full w-16 [mask-image:linear-gradient(to_right,white,transparent)]"
            style={{ background: "var(--bg)" }}
          />
        </motion.div>
        {/* right beam (mirrored) */}
        <motion.div
          initial={{ opacity: 0.4, width: "7rem" }}
          animate={{ opacity: 1, width: "14rem" }}
          transition={transition}
          style={{ backgroundImage: `conic-gradient(from 290deg at center top, transparent 40%, var(--accent))` }}
          className="absolute inset-auto left-1/2 h-full w-56 text-transparent"
        >
          <div
            className="absolute bottom-0 right-0 h-full w-16 [mask-image:linear-gradient(to_left,white,transparent)]"
            style={{ background: "var(--bg)" }}
          />
          <div
            className="absolute bottom-0 right-0 h-2/3 w-full [mask-image:linear-gradient(to_top,white,transparent)]"
            style={{ background: "var(--bg)" }}
          />
        </motion.div>

        {/* soft glow */}
        <div
          className="absolute inset-x-auto top-1/3 h-14 w-56 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
          style={{ background: "var(--accent)" }}
        />
        <motion.div
          initial={{ width: "5rem" }}
          animate={{ width: "9rem" }}
          transition={transition}
          className="absolute top-1/3 h-10 -translate-y-1/2 rounded-full blur-2xl"
          style={{ background: "var(--accent)" }}
        />

        {/* bright filament line */}
        <motion.div
          initial={{ width: "7rem", opacity: 0 }}
          animate={{ width: "14rem", opacity: 1 }}
          transition={transition}
          className="absolute top-1/3 h-px -translate-y-1/2"
          style={{ background: "var(--accent)", boxShadow: "0 0 12px 1px var(--accent)" }}
        />
      </div>
    </div>
  );
}
