"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { LinkPreview } from "@/components/ui/link-preview";
import { PixelatedCanvas } from "@/components/ui/pixelated-canvas";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { InView } from "@/components/motion-primitives/in-view";
import { useIsDark } from "@/lib/use-is-dark";

const links: { key: "linkEmail" | "linkGithub" | "linkLeetcode" | "linkLinkedin" | "linkX"; href: string }[] = [
  { key: "linkEmail", href: "mailto:hello@chirag.dev" },
  { key: "linkGithub", href: "https://github.com/chirag405" },
  { key: "linkLeetcode", href: "https://leetcode.com/chirag406" },
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
  const isDark = useIsDark();
  const [showPitch, setShowPitch] = useState(false);

  return (
    <footer id="contact" className="py-10 pt-[clamp(40px,7vh,80px)]">
      <div className="grid grid-cols-1 items-end gap-10 sm:grid-cols-[1fr_auto]">
        <div>
          <InView
            once
            viewOptions={{ once: true, amount: 0.4 }}
            onEnter={() => setShowPitch(true)}
          >
            <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[color:var(--muted)]">
              <span
                className="inline-block h-[7px] w-[7px] rounded-full"
                style={{ background: "oklch(.72 .15 165)", boxShadow: "0 0 0 3px oklch(.72 .15 165 / .18)" }}
              />
              {t("availableBadge")}
            </div>
            {showPitch && (
              <TextGenerateEffect
                words={t("pitch")}
                className="max-w-[46ch] text-[15px] leading-[1.7] sm:text-[18px]"
              />
            )}
          </InView>
          <div
            className="mt-9 font-serif"
            style={{ fontSize: "clamp(30px,5vw,54px)", lineHeight: 1, letterSpacing: "-0.01em" }}
          >
            {t("heading")}
          </div>
          <div className="mt-6 flex flex-wrap gap-2.5 text-[12.5px]">
            {links.map((l) => {
              const isExternal = l.href.startsWith("http");
              const label = (
                <span className="block border border-[color:var(--line)] px-[13px] py-2 text-[color:var(--fg)]">
                  {t(l.key)}
                </span>
              );
              return isExternal ? (
                <LinkPreview key={l.key} url={l.href} target="_blank" rel="noopener noreferrer" data-cursor="open">
                  {label}
                </LinkPreview>
              ) : (
                <a key={l.key} href={l.href} data-cursor="open">
                  {label}
                </a>
              );
            })}
          </div>
        </div>
        <div className="justify-self-start border sm:justify-self-end" style={{ borderColor: "var(--line)" }} data-cursor="drag">
          <PixelatedCanvas
            src="/images/chirag.jpg"
            width={240}
            height={330}
            cellSize={3}
            dotScale={1}
            shape="square"
            backgroundColor={isDark ? "#000000" : "#fafaf8"}
            grayscale
            dropoutStrength={0.1}
            interactive
            distortionStrength={3}
            distortionRadius={90}
            distortionMode="swirl"
            followSpeed={0.2}
            tintColor="#000000"
            tintStrength={0}
            objectFit="cover"
            jitterStrength={2}
            jitterSpeed={2}
            fadeOnLeave
            fadeSpeed={0.1}
            className="block"
          />
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
