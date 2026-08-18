"use client";

import { useLayoutEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";

type Theme = "light" | "dark";

function resolveTheme(): Theme {
  try {
    const stored = localStorage.getItem("chirag-theme");
    if (stored === "dark" || stored === "light") return stored;
  } catch {}
  const systemDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  return systemDark ? "dark" : "light";
}

export function ThemeToggle() {
  const t = useTranslations("header");
  const pathname = usePathname();
  const [theme, setTheme] = useState<Theme | null>(null);

  useLayoutEffect(() => {
    // A locale switch is a client-side route transition, not a full reload —
    // Next re-renders <html> from the new route's tree, which drops the
    // data-theme attribute since it's set imperatively outside React's props
    // for that element. Reapply it (before paint) on every navigation.
    const resolved = resolveTheme();
    document.documentElement.setAttribute("data-theme", resolved);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(resolved);
  }, [pathname]);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("chirag-theme", next);
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      title={t("themeToggleTitle")}
      aria-label={t("themeToggleTitle")}
      data-cursor="toggle"
      className="relative flex h-5 w-5 items-center justify-center text-[color:var(--muted)] transition-colors hover:text-[color:var(--fg)]"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme ?? "light"}
          initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center"
        >
          {theme === "dark" ? <MoonIcon /> : <SunIcon />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.4M12 19.1v2.4M4.4 4.4l1.7 1.7M17.9 17.9l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.4 19.6l1.7-1.7M17.9 6.1l1.7-1.7" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.6 14.7A8.5 8.5 0 1 1 9.3 3.4a7 7 0 0 0 11.3 11.3Z" />
    </svg>
  );
}
