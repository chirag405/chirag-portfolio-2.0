"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { Magnetic } from "@/components/motion-primitives/magnetic";
import { downloadResume } from "@/lib/download-resume";

function useTypedText(target: string, speedMs = 42) {
  const [text, setText] = useState("");

  useEffect(() => {
    let i = 0;
    // Resets the typewriter animation whenever `target` changes (e.g. locale switch) — not a cascading derived-state update.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setText("");
    const id = setInterval(() => {
      i++;
      setText(target.slice(0, i));
      if (i >= target.length) clearInterval(id);
    }, speedMs);
    return () => clearInterval(id);
  }, [target, speedMs]);

  return text;
}

export function Hero() {
  const t = useTranslations("hero");
  const whoami = useTypedText(t("terminalWhoamiOutput"));
  const [flourish, setFlourish] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setFlourish(false), 1000);
    return () => clearTimeout(id);
  }, []);

  return (
    <section className="relative grid grid-cols-1 items-end gap-9 border-b border-[color:var(--line)] py-[clamp(40px,7vh,76px)] pt-[clamp(56px,10vh,116px)] lg:grid-cols-[1.4fr_0.82fr] lg:gap-[clamp(28px,5vw,72px)]">
      <div className="min-w-0">
        <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2.5 text-xs uppercase tracking-[0.14em] text-[color:var(--muted)]">
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

        <h1
          className="m-0 font-serif font-normal"
          style={{
            lineHeight: 0.88,
            letterSpacing: "-0.015em",
            fontSize: "clamp(64px,11.5vw,156px)",
          }}
        >
          <span className="block overflow-hidden">
            <TextEffect as="span" per="line" preset="slide" delay={0.05} className="inline-block">
              {t("firstName")}
            </TextEffect>
          </span>
          <span className="block overflow-hidden">
            <TextEffect as="span" per="line" preset="slide" delay={0.16} className="inline-block">
              {`${t("lastName")}.`}
            </TextEffect>
          </span>
        </h1>

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
            <a
              href="https://github.com/chirag405"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="open"
              className="inline-block border border-[color:var(--line)] px-3.5 py-[9px] text-[color:var(--fg)]"
            >
              {t("ctaGithub")}
            </a>
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
            <div className="font-serif text-[32px] leading-none">9</div>
            <div className="mt-1 text-[10.5px] text-[color:var(--muted)]">{t("statProjectsLabel")}</div>
          </div>
          <div>
            <div className="font-serif text-[32px] leading-none">1</div>
            <div className="mt-1 text-[10.5px] text-[color:var(--muted)]">{t("statPublicationsLabel")}</div>
          </div>
        </div>
      </div>

      <div className="min-w-0 border border-[color:var(--line)]" style={{ background: "var(--card)" }}>
        <div className="flex items-center gap-[7px] border-b border-[color:var(--line2)] px-3 py-[9px]">
          <span className="h-[9px] w-[9px] rounded-full" style={{ background: "var(--line)" }} />
          <span className="h-[9px] w-[9px] rounded-full" style={{ background: "var(--line)" }} />
          <span className="h-[9px] w-[9px] rounded-full" style={{ background: "var(--line)" }} />
          <span className="ml-1.5 text-[11px] text-[color:var(--faint)]">{t("terminalWindowTitle")}</span>
        </div>
        <div className="px-4 pb-[18px] pt-4 text-[12.5px] leading-[1.85]">
          <div>
            <span style={{ color: "var(--accent)" }}>$</span> {t("terminalWhoamiCmd")}
          </div>
          <div className="text-[color:var(--fg)]">
            {whoami}
            <span
              className="ml-0.5 inline-block h-[14px] w-[7px] align-[-2px]"
              style={{ background: "var(--accent)", animation: "blink 1s step-end infinite" }}
            />
          </div>
          <div className="mt-2.5">
            <span style={{ color: "var(--accent)" }}>$</span> {t("terminalRoleCmd")}
          </div>
          <div className="whitespace-pre-wrap text-[color:var(--muted)]">
            {"{\n  \"focus\": [\"genai\",\"full-stack\"],\n  \"ships\": \"llm systems in prod\",\n  \"based\": \"IN\",\n  \"status\": "}
            <span style={{ color: "var(--accent)" }}>{`"${t("terminalStatus")}"`}</span>
            {"\n}"}
          </div>
          <div className="mt-2.5 text-[color:var(--faint)]">
            $ {t.rich("terminalHint", {
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
