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
 *
 * Sized via `inset-0` so it exactly fills its parent (the two-line "Chirag
 * / Singh." wrapper) rather than a guessed fixed height — the glow wash and
 * beams both scale to `h-full`, so they reach the second line too instead
 * of fading out after the first.
 */
export function NameLamp() {
  const isDark = useIsDark();
  const prefersReducedMotion = useReducedMotion();

  if (!isDark) return null;

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-visible">
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

        {/* tall ambient wash — spans the full two-line height, brightest near the top and fading down */}
        <motion.div
          initial={{ opacity: 0, height: "45%" }}
          animate={{ opacity: 0.55, height: "100%" }}
          transition={transition}
          className="absolute left-1/2 top-0 w-72 -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background: "var(--accent)",
            maskImage: "linear-gradient(to bottom, white, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, white, transparent)",
          }}
        />
        <motion.div
          initial={{ width: "5rem" }}
          animate={{ width: "10rem" }}
          transition={transition}
          className="absolute top-0 h-24 -translate-y-2 rounded-full blur-2xl"
          style={{ background: "var(--accent)" }}
        />

        {/* bright filament line — the light source, right above the text */}
        <motion.div
          initial={{ width: "7rem", opacity: 0 }}
          animate={{ width: "14rem", opacity: 1 }}
          transition={transition}
          className="absolute top-0 h-px"
          style={{ background: "var(--accent)", boxShadow: "0 0 12px 1px var(--accent)" }}
        />
      </div>
    </div>
  );
}
