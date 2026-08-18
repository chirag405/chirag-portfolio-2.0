"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, useMotionValueEvent, useScroll } from "motion/react";

const SECTIONS = [
  { id: "systems", labelKey: "navSystems" },
  { id: "experience", labelKey: "navExperience" },
  { id: "work", labelKey: "navWork" },
  { id: "publications", labelKey: "navPublications" },
  { id: "stack", labelKey: "navStack" },
  { id: "contact", labelKey: "navContact" },
] as const;

/**
 * Replaces the old fixed left-side section rail — a floating, frosted-glass
 * pill navbar (iOS control-center style) docked to the top of the viewport.
 * Hides on scroll-down, reappears on scroll-up or once back near the top,
 * mirroring the show/hide behavior of iOS Safari's own toolbar.
 */
export function FloatingNavbar() {
  const t = useTranslations("header");
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);
  const [visible, setVisible] = useState(true);
  const { scrollY } = useScroll();
  const lastY = useRef(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    const goingDown = y > lastY.current;
    const pastThreshold = y > 120;
    setVisible(!goingDown || !pastThreshold);
    lastY.current = y;
  });

  useEffect(() => {
    const elements = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const idx = SECTIONS.findIndex((s) => s.id === entry.target.id);
          if (idx !== -1) setActiveId(SECTIONS[idx].id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.nav
      aria-label="Section navigation"
      initial={false}
      animate={visible ? { y: 0, opacity: 1 } : { y: -20, opacity: 0 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-4 z-40 flex justify-center px-4"
      style={{ pointerEvents: visible ? "auto" : "none" }}
    >
      <div
        className="flex items-center gap-0.5 rounded-full border px-1.5 py-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
        style={{
          borderColor: "var(--line)",
          background: "color-mix(in oklab, var(--card) 62%, transparent)",
          backdropFilter: "blur(20px) saturate(1.6)",
          WebkitBackdropFilter: "blur(20px) saturate(1.6)",
        }}
      >
        {SECTIONS.map((s) => {
          const isActive = s.id === activeId;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              data-cursor="view"
              aria-current={isActive ? "true" : undefined}
              className="relative rounded-full px-3.5 py-1.5 text-[11.5px] uppercase tracking-[0.08em] transition-colors duration-200"
              style={{ color: isActive ? "var(--bg)" : "var(--muted)" }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = "var(--fg)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = "var(--muted)";
              }}
            >
              {isActive && (
                <motion.span
                  layoutId="floating-nav-pill"
                  className="absolute inset-0 -z-10 rounded-full"
                  style={{ background: "var(--accent)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              {t(s.labelKey)}
            </a>
          );
        })}
      </div>
    </motion.nav>
  );
}
