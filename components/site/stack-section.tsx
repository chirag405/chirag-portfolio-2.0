"use client";

import { useTranslations } from "next-intl";
import { InView } from "@/components/motion-primitives/in-view";
import { InfiniteSlider } from "@/components/motion-primitives/infinite-slider";
import { skills } from "@/lib/data/portfolio";

const LOGO_SLUGS = [
  "python",
  "pytorch",
  "fastapi",
  "nextdotjs",
  "react",
  "typescript",
  "anthropic",
  "langchain",
  "supabase",
  "postgresql",
  "docker",
  "kubernetes",
  "redis",
  "vercel",
  "googlecloud",
  "cloudflare",
  "flutter",
  "dart",
  "nodedotjs",
  "githubactions",
  "firebase",
  "opentelemetry",
  "clickhouse",
  "git",
];

function LogoStrip() {
  return (
    <InfiniteSlider gap={44} speed={32} speedOnHover={10} className="mb-9 py-1">
      {LOGO_SLUGS.map((slug) => (
        <img
          key={slug}
          src={`https://cdn.simpleicons.org/${slug}`}
          alt={slug}
          loading="lazy"
          className="h-6 w-auto flex-none opacity-70 grayscale transition-[opacity,filter] duration-200 hover:opacity-100 hover:grayscale-0"
        />
      ))}
    </InfiniteSlider>
  );
}

export function StackSection() {
  const t = useTranslations("stack");
  return (
    <InView
      as="section"
      id="stack"
      once
      variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      viewOptions={{ once: true, amount: 0.2 }}
      className="border-b py-[clamp(48px,8vh,92px)]"
      style={{ borderColor: "var(--line)" }}
    >
      <div className="mb-9 text-[12.5px] uppercase tracking-[0.14em] text-[color:var(--muted)]">{t("eyebrow")}</div>
      <LogoStrip />
      <div className="flex flex-col gap-7">
        {skills.map((g) => (
          <div key={g.cat} className="grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-[180px_1fr]">
            <div className="text-xs" style={{ color: "var(--accent)" }}>
              {g.cat}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {g.items.map((s) => (
                <span
                  key={s}
                  className="border px-2.5 py-1 text-[12px]"
                  style={{ borderColor: "var(--line)", color: "var(--fg)" }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </InView>
  );
}
