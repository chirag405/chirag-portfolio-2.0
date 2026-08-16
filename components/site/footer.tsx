"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const links: { key: "linkEmail" | "linkGithub" | "linkLeetcode" | "linkLinkedin" | "linkX"; href: string }[] = [
  { key: "linkEmail", href: "mailto:hello@chirag.dev" },
  { key: "linkGithub", href: "https://github.com/chirag405" },
  { key: "linkLeetcode", href: "https://leetcode.com/chirag405" },
  { key: "linkLinkedin", href: "https://www.linkedin.com/in/chirag404/" },
  { key: "linkX", href: "https://x.com/chirag405" },
];

function useClock() {
  const [clock, setClock] = useState("");
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const p = (n: number) => String(n).padStart(2, "0");
      setClock(`${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return clock;
}

export function Footer() {
  const t = useTranslations("footer");
  const clock = useClock();
  const year = new Date().getFullYear();

  return (
    <footer className="py-10 pt-[clamp(40px,7vh,80px)]">
      <div className="grid grid-cols-1 items-end gap-6 sm:grid-cols-[1fr_auto]">
        <div>
          <div
            className="font-serif"
            style={{ fontSize: "clamp(30px,5vw,54px)", lineHeight: 1, letterSpacing: "-0.01em" }}
          >
            {t("heading")}
          </div>
          <div className="mt-6 flex flex-wrap gap-2.5 text-[12.5px]">
            {links.map((l) => (
              <a
                key={l.key}
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                data-cursor="open"
                className="border border-[color:var(--line)] px-[13px] py-2 text-[color:var(--fg)]"
              >
                {t(l.key)}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-11 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[color:var(--line2)] pt-4 text-[11px] text-[color:var(--faint)]">
        <span className="flex items-center gap-[7px]">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: "oklch(.72 .15 165)" }} />
          {t("operational")}
        </span>
        <span>·</span>
        <span suppressHydrationWarning>
          {clock} {t("timezone")}
        </span>
        <span>·</span>
        <span>
          {t("buildLabel")} <span className="text-[color:var(--muted)]">a3f9c1</span>
        </span>
        <span>·</span>
        <span>
          {t("deployedLabel")} {t("deployedAgo")}
        </span>
        <span className="ml-auto">{t("copyright", { year })}</span>
      </div>
    </footer>
  );
}
