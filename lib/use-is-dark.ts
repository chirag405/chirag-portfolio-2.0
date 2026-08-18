"use client";

import { useEffect, useState } from "react";

/** Tracks the live data-theme attribute (set by ThemeScript / ThemeToggle) so components can react to theme changes without a page reload. */
export function useIsDark() {
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
