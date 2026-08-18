"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { IconChevronRight, IconLink, IconX } from "@tabler/icons-react";
import { InView } from "@/components/motion-primitives/in-view";
import { DirectionAwareHover } from "@/components/ui/direction-aware-hover";
import { projects, type Project } from "@/lib/data/portfolio";

function CardText({ p }: { p: Project }) {
  return (
    <div className="p-5">
      <div className="text-[11px] uppercase tracking-[0.1em] text-white/70">{p.kind}</div>
      <div className="mt-1 font-serif text-[26px] leading-none text-white">{p.name}</div>
      <p className="mt-2.5 line-clamp-2 max-w-[38ch] text-[12.5px] leading-[1.55] text-white/75">{p.impact}</p>
    </div>
  );
}

function ProjectCard({ p, onOpen }: { p: Project; onOpen: () => void }) {
  if (p.image) {
    return (
      <button onClick={onOpen} data-cursor="expand" className="block w-full text-left">
        <DirectionAwareHover imageUrl={p.image} childrenClassName="w-full">
          <CardText p={p} />
        </DirectionAwareHover>
      </button>
    );
  }

  return (
    <button
      onClick={onOpen}
      data-cursor="expand"
      className="group/card relative flex aspect-[2/3] w-full flex-col justify-end overflow-hidden rounded-2xl border text-left"
      style={{ borderColor: "var(--line)", background: "linear-gradient(160deg, var(--card), var(--bg))" }}
    >
      <span
        className="pointer-events-none absolute inset-0 flex items-center justify-center font-serif text-[9rem] leading-none opacity-[0.06] transition-transform duration-500 group-hover/card:scale-105"
        style={{ color: "var(--fg)" }}
      >
        {p.no}
      </span>
      <div className="relative p-5">
        <div className="text-[11px] uppercase tracking-[0.1em]" style={{ color: "var(--muted)" }}>
          {p.kind}
        </div>
        <div className="mt-1 font-serif text-[26px] leading-none" style={{ color: "var(--fg)" }}>
          {p.name}
        </div>
        <p className="mt-2.5 line-clamp-2 max-w-[38ch] text-[12.5px] leading-[1.55]" style={{ color: "var(--muted)" }}>
          {p.impact}
        </p>
      </div>
    </button>
  );
}

function RowLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="open"
      className="flex items-center justify-between border-b py-4 text-[14px] transition-colors duration-200"
      style={{ borderColor: "var(--line2)", color: "var(--fg)" }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg)")}
    >
      {label}
      <IconChevronRight size={16} style={{ color: "var(--faint)" }} />
    </a>
  );
}

function ProjectModal({ p, onClose }: { p: Project; onClose: () => void }) {
  const t = useTranslations("work");
  const isLive = p.href !== "#";

  return (
    <motion.div
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex justify-center"
      style={{ background: "rgba(10,10,10,.55)", backdropFilter: "blur(3px)" }}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 24 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="h-screen w-full overflow-y-auto border-l sm:w-[60vw]"
        style={{ borderColor: "var(--line)", background: "var(--bg)" }}
      >
        <div className="flex items-start justify-between p-6 pb-0 sm:p-10 sm:pb-0">
          <div>
            <div className="text-[11px] uppercase tracking-[0.1em]" style={{ color: "var(--accent)" }}>
              {p.kind}
            </div>
            <div
              className="mt-2 font-serif"
              style={{ fontSize: "clamp(34px,5.5vw,64px)", lineHeight: 1.02, color: "var(--fg)" }}
            >
              {p.name}
            </div>
          </div>
          <button onClick={onClose} data-cursor="close" className="flex-none border-none bg-transparent" style={{ color: "var(--muted)" }}>
            <IconX size={22} />
          </button>
        </div>

        {p.image && (
          <div className="mt-8 aspect-[16/9] overflow-hidden sm:mx-10" style={{ background: "var(--card)" }}>
            <img src={p.image} alt={p.name} className="h-full w-full object-cover object-top" />
          </div>
        )}

        <div className="m-6 border p-6 sm:m-10 sm:p-8" style={{ borderColor: "var(--line)", background: "var(--card)" }}>
          <div className="text-[11px] uppercase tracking-[0.1em]" style={{ color: "var(--muted)" }}>
            {p.no}
          </div>
          <p className="mt-4 text-[15px] leading-[1.8]" style={{ color: "var(--fg)" }}>
            {p.impact}
          </p>
          <div className="mt-7 text-[11px] uppercase tracking-[0.1em]" style={{ color: "var(--muted)" }}>
            {t("technologies")}
          </div>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {p.tags.map((tag) => (
              <span
                key={tag}
                className="border px-2.5 py-1 text-[11.5px]"
                style={{ borderColor: "var(--line)", color: "var(--muted)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mx-6 mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] sm:mx-10" style={{ color: "var(--muted)" }}>
          <IconLink size={13} />
          {t("links")}
        </div>
        <div className="mx-6 mb-10 sm:mx-10">
          {isLive && <RowLink label={t("website")} href={p.href} />}
          {p.github && <RowLink label={t("github")} href={p.github} />}
          {!isLive && !p.github && (
            <div className="py-4 text-[13px]" style={{ color: "var(--faint)" }}>
              {t("notYetLive")}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function WorkSection() {
  const t = useTranslations("work");
  const [active, setActive] = useState<Project | null>(null);

  return (
    <InView
      as="section"
      id="work"
      once
      variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      viewOptions={{ once: true, amount: 0.1 }}
      className="border-b py-[clamp(48px,8vh,92px)]"
      style={{ borderColor: "var(--line)" }}
    >
      <div className="mb-7.5 flex items-baseline justify-between gap-4">
        <div className="text-[12.5px] uppercase tracking-[0.14em] text-[color:var(--muted)]">{t("eyebrow")}</div>
        <div className="text-[11px] text-[color:var(--faint)]">{t("hint")}</div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard key={p.id} p={p} onOpen={() => setActive(p)} />
        ))}
      </div>

      <AnimatePresence>{active && <ProjectModal p={active} onClose={() => setActive(null)} />}</AnimatePresence>
    </InView>
  );
}
