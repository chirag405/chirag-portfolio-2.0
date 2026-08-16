"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { localeNames, routing, type Locale } from "@/i18n/routing";

export function LanguageSwitcher() {
  const t = useTranslations("languageSwitcher");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value as Locale;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div className="relative flex items-center">
      <select
        aria-label={t("label")}
        data-cursor="select"
        value={locale}
        onChange={onChange}
        disabled={isPending}
        className="cursor-pointer appearance-none border border-[color:var(--line)] bg-transparent py-1 pl-2 pr-5 text-[11.5px] text-[color:var(--fg)] outline-none disabled:opacity-50"
      >
        {routing.locales.map((l) => (
          <option key={l} value={l} className="bg-[color:var(--card)] text-[color:var(--fg)]">
            {localeNames[l]}
          </option>
        ))}
      </select>
      <svg
        aria-hidden="true"
        width="9"
        height="9"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        className="pointer-events-none absolute right-1.5 text-[color:var(--faint)]"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  );
}
