"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { useIsDark } from "@/lib/use-is-dark";

const SIZE = 640;

/**
 * Retheme of motion-primitives' Spotlight (https://motion-primitives.com/docs/spotlight) —
 * the original attaches to a single hovered card and lights up on mouseenter/leave. Ported
 * into a page-level ambient glow instead: it tracks the cursor across the whole viewport via
 * `window` mousemove (rather than one parent element) and sits behind all content at `-z-10`,
 * so it only reads on the free/empty background between sections — opaque cards and text paint
 * over it same as they do the page background. Dark mode only, matches the accent hue lever.
 */
export function AmbientSpotlight() {
  const isDark = useIsDark();
  const prefersReducedMotion = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { bounce: 0 });
  const springY = useSpring(rawY, { bounce: 0 });
  const x = prefersReducedMotion ? rawX : springX;
  const y = prefersReducedMotion ? rawY : springY;

  useEffect(() => {
    if (!isDark) return;
    const handleMove = (event: MouseEvent) => {
      rawX.set(event.clientX);
      rawY.set(event.clientY);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [isDark, rawX, rawY]);

  if (!isDark) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{
          width: SIZE,
          height: SIZE,
          left: x,
          top: y,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle at center, var(--accent) 0%, transparent 72%)",
          opacity: 0.22,
        }}
      />
    </div>
  );
}
