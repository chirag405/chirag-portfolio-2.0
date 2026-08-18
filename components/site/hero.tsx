"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { Magnetic } from "@/components/motion-primitives/magnetic";
import { Terminal } from "@/components/ui/terminal";
import { LinkPreview } from "@/components/ui/link-preview";
import { NameLamp } from "@/components/site/name-lamp";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { HueAdaptiveSlider } from "@/components/site/hue-adaptive-slider";
import { downloadResume } from "@/lib/download-resume";
import { createTerminalCommandHandler } from "@/lib/terminal-commands";
import { projects } from "@/lib/data/portfolio";

export function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const handleTerminalCommand = useMemo(() => createTerminalCommandHandler(locale), [locale]);
  const [flourish, setFlourish] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setFlourish(false), 1000);
    return () => clearTimeout(id);
  }, []);

  return (
    <section className="relative border-b border-[color:var(--line)] py-[clamp(40px,7vh,76px)] pt-[clamp(56px,10vh,116px)]">
      <div className="mb-9 flex flex-nowrap items-center justify-between gap-x-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2.5 text-xs uppercase tracking-[0.14em] text-[color:var(--muted)]">
          <span className="flex items-center gap-2">
            <span
              className="inline-block h-[7px] w-[7px] rounded-full"
              style={{
                background: "oklch(.72 .15 165)",
                boxShadow: "0 0 0 3px oklch(.72 .15 165 / .18)",
              }}
            />
            {t("availableForWork")}
          </span>
          <span className="h-px w-6 bg-[color:var(--line)]" />
          <span>{t("roleTag")}</span>
        </div>
        <div className="flex flex-none items-center gap-2">
          <LanguageSwitcher compact />
          <ThemeToggle />
          <HueAdaptiveSlider />
        </div>
      </div>

      <div className="grid grid-cols-1 items-end gap-9 lg:grid-cols-[1.4fr_0.82fr] lg:gap-[clamp(28px,5vw,72px)]">
      <div className="min-w-0">
        <div className="relative">
          <NameLamp />
          <h1
            className="relative z-10 m-0 font-serif font-normal"
            style={{
              lineHeight: 1.04,
              letterSpacing: "0.035em",
              fontSize: "clamp(44px,7.8vw,104px)",
            }}
          >
            <span className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
              <TextEffect as="span" per="line" preset="slide" delay={0.05} className="inline-block">
                {t("firstName")}
              </TextEffect>
            </span>
            <span className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
              <TextEffect as="span" per="line" preset="slide" delay={0.16} className="inline-block">
                {`${t("lastName")}.`}
              </TextEffect>
            </span>
          </h1>
        </div>

        <p className="mt-8 max-w-[46ch] text-[15px] leading-[1.72] text-[color:var(--fg)]">
          {t("introLead")} <span style={{ color: "var(--accent)" }}>{t("introAccent")}</span>{" "}
          {t("introMid")} <span className="text-[color:var(--muted)]">{t("introMuted")}</span>
        </p>

        <div className="mt-8 flex flex-wrap gap-2.5 text-[12.5px]">
          <Magnetic range={70} intensity={0.3}>
            <a
              href="#work"
              data-cursor="view"
              className="inline-block border px-[15px] py-[9px]"
              style={{ borderColor: "var(--accent)", background: "var(--accent)", color: "var(--bg)" }}
            >
              {t("ctaWork")}
            </a>
          </Magnetic>
          <Magnetic range={70} intensity={0.3}>
            <LinkPreview
              url="https://github.com/chirag405"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="open"
              className="inline-block border border-[color:var(--line)] px-3.5 py-[9px] text-[color:var(--fg)]"
            >
              {t("ctaGithub")}
            </LinkPreview>
          </Magnetic>
          <Magnetic range={70} intensity={0.3}>
            <a
              href="#resume"
              data-cursor="download"
              onClick={(e) => {
                e.preventDefault();
                downloadResume();
              }}
              className="inline-block border border-[color:var(--line)] px-3.5 py-[9px] text-[color:var(--fg)]"
            >
              {t("ctaResume")}
            </a>
          </Magnetic>
        </div>

        <div className="mt-11 flex flex-wrap gap-x-8 gap-y-0">
          <div className="border-r border-[color:var(--line2)] pr-8">
            <div className="font-serif text-[32px] leading-none">
              1.8<span className="text-[15px] text-[color:var(--muted)]"> {t("statYearsUnit")}</span>
            </div>
            <div className="mt-1 text-[10.5px] text-[color:var(--muted)]">{t("statYearsLabel")}</div>
          </div>
          <div className="border-r border-[color:var(--line2)] pr-8">
            <div className="font-serif text-[32px] leading-none">{projects.length}</div>
            <div className="mt-1 text-[10.5px] text-[color:var(--muted)]">{t("statProjectsLabel")}</div>
          </div>
          <div>
            <div className="font-serif text-[32px] leading-none">1</div>
            <div className="mt-1 text-[10.5px] text-[color:var(--muted)]">{t("statPublicationsLabel")}</div>
          </div>
        </div>
      </div>

      <div className="min-w-0">
        <Terminal
          username="chirag"
          title={t("terminalWindowTitle")}
          promptStyle="bare"
          typingSpeed={42}
          delayBetweenCommands={600}
          initialDelay={300}
          commands={[t("terminalWhoamiCmd"), t("terminalRoleCmd")]}
          outputs={{
            0: [t("terminalWhoamiOutput")],
            1: [
              "{",
              '  "focus": ["genai","full-stack"],',
              '  "ships": "llm systems in prod",',
              '  "based": "IN",',
              `  "status": "${t("terminalStatus")}"`,
              "}",
            ],
          }}
          onCommand={handleTerminalCommand}
          inputPlaceholder={t("terminalInputPlaceholder")}
        />
        <div className="mt-2.5 text-[11px] text-[color:var(--faint)]">
          ${" "}
          {t.rich("terminalHint", {
            fg: (chunks) => <span className="text-[color:var(--fg)]">{chunks}</span>,
          })}
        </div>
      </div>
      </div>

      {flourish && (
        <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
          <div
            className="absolute left-[2%] top-[58%] h-[3px] w-[62%] origin-left"
            style={{
              background: "var(--accent)",
              filter: "blur(1px)",
              animation: "flareUp .62s cubic-bezier(.16,1,.3,1) both",
              boxShadow: "0 0 22px 4px var(--accent-weak)",
            }}
          />
          <svg
            viewBox="0 0 600 300"
            preserveAspectRatio="none"
            className="absolute left-0 top-0 h-full w-[70%] overflow-visible"
          >
            <path
              d="M8 250 L520 40"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeDasharray="520"
              style={{
                animation: "slashSweep .72s cubic-bezier(.16,1,.3,1) both",
                filter: "drop-shadow(0 0 6px var(--accent))",
              }}
            />
          </svg>
        </div>
      )}
    </section>
  );
}
