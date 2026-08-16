import { useTranslations } from "next-intl";
import { HueLever } from "@/components/site/hue-lever";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { LanguageSwitcher } from "@/components/site/language-switcher";

export function Header() {
  const t = useTranslations("header");

  return (
    <div
      className="sticky top-0 z-40 -mx-[clamp(20px,5vw,64px)] flex h-14 items-center justify-between gap-4 border-b border-[color:var(--line2)] px-[clamp(20px,5vw,64px)] backdrop-blur-[8px]"
      style={{ background: "color-mix(in oklab, var(--bg) 82%, transparent)" }}
    >
      <div className="flex items-center gap-3 text-[12.5px] tracking-[0.02em]">
        <span
          className="inline-block h-[7px] w-[7px] rounded-full"
          style={{ background: "var(--accent)", animation: "pulse 2.4s ease-in-out infinite" }}
        />
        <span className="font-medium text-[color:var(--fg)]">{t("name")}</span>
        <span className="text-[color:var(--faint)]">·</span>
        <span className="text-[color:var(--muted)]">{t("role")}</span>
      </div>
      <div className="flex items-center gap-5">
        <nav className="hidden items-center gap-5 text-[12.5px] text-[color:var(--muted)] sm:flex">
          <a href="#systems" className="text-[color:var(--muted)] hover:text-[color:var(--fg)]">
            {t("navSystems")}
          </a>
          <a href="#work" className="text-[color:var(--muted)] hover:text-[color:var(--fg)]">
            {t("navWork")}
          </a>
          <a href="#stack" className="text-[color:var(--muted)] hover:text-[color:var(--fg)]">
            {t("navStack")}
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
          <HueLever />
        </div>
      </div>
    </div>
  );
}
