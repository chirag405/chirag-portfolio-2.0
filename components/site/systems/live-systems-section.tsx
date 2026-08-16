import { getTranslations } from "next-intl/server";
import { GithubCard } from "./github-card";
import { LeetcodeCard } from "./leetcode-card";
import { ObservabilityCard } from "./observability-card";

export async function LiveSystemsSection() {
  const t = await getTranslations("systems");

  return (
    <section
      id="systems"
      className="border-b py-[clamp(48px,8vh,92px)]"
      style={{ borderColor: "var(--line)" }}
    >
      <div className="mb-7.5 flex items-baseline justify-between gap-4">
        <div className="text-[12.5px] uppercase tracking-[0.14em] text-[color:var(--muted)]">{t("eyebrow")}</div>
        <div className="flex items-center gap-2 text-[11.5px] text-[color:var(--faint)]">
          {t("syncedAgo")}
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--accent)", animation: "pulse 2.4s ease-in-out infinite" }}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr]">
        <GithubCard />
        <LeetcodeCard />
        <ObservabilityCard />
      </div>
      <div className="mt-3.5 text-[10.5px] text-[color:var(--faint)]">{t("footnote")}</div>
    </section>
  );
}
