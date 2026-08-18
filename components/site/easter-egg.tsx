"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { resumeJson } from "@/lib/data/portfolio";
import { openResume } from "@/lib/download-resume";

export function EasterEgg() {
  const t = useTranslations("easterEgg");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let buf = "";
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key && e.key.length === 1) {
        buf = (buf + e.key.toLowerCase()).slice(-8);
        if (buf.endsWith("whoami")) setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          onClick={() => setOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center p-6"
          style={{ background: "rgba(10,10,10,.55)", backdropFilter: "blur(3px)" }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 8, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.985 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="w-[min(520px,94vw)] border"
            style={{ borderColor: "var(--accent)", background: "#0A0A0A", color: "#FAFAF8" }}
          >
            <div className="flex items-center gap-1.5 border-b px-3.5 py-2.5" style={{ borderColor: "rgba(255,255,255,.12)" }}>
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--accent)" }} />
              <span className="text-[11px]" style={{ color: "rgba(255,255,255,.55)" }}>
                {t("title")}
              </span>
              <button
                onClick={() => setOpen(false)}
                className="ml-auto border-none bg-transparent"
                style={{ color: "rgba(255,255,255,.55)" }}
              >
                ✕
              </button>
            </div>
            <pre className="m-0 whitespace-pre-wrap p-5 text-[12.5px] leading-[1.7]" style={{ color: "#e8e8e2" }}>
              {resumeJson()}
            </pre>
            <div className="px-5 pb-5">
              <a
                href="#resume"
                onClick={(e) => {
                  e.preventDefault();
                  openResume();
                }}
                className="text-[12.5px]"
                style={{ color: "var(--accent)" }}
              >
                {t("download")}
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
