"use client";
import { useScroll, useTransform, motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";

export interface TimelineEntry {
  /** Date-range label rendered directly on the rail next to the dot. */
  title: React.ReactNode;
  content: React.ReactNode;
}

/**
 * Retheme of Aceternity's Timeline (https://ui.aceternity.com) for the
 * portfolio's own design tokens (--bg/--fg/--line/--accent) instead of the
 * stock neutral/purple-blue palette, and with the hardcoded heading removed
 * so callers can supply their own translated copy.
 */
export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  // A one-shot getBoundingClientRect() on mount measures the row heights
  // before web fonts (Instrument Serif) finish loading and swap in — the
  // fallback font is shorter, so the line was frozen at that smaller height
  // with nothing to re-measure once the real font pushed the cards taller.
  // ResizeObserver keeps it correct through font swap, content changes, and
  // viewport resizes.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setHeight(entry.contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 15%", "end 60%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  const rail = "clamp(140px,19vw,200px)";
  const dotLeft = `calc(-1 * ${rail} + clamp(1px,1vw,7px))`;

  return (
    <div className="w-full" ref={containerRef}>
      <div ref={ref} className="relative" style={{ paddingLeft: rail }}>
        {data.map((item, index) => (
          <div key={index} className="relative mb-3.5 flex gap-4">
            <div
              className="absolute top-[26px] h-[9px] w-[9px] flex-none rounded-full"
              style={{
                left: dotLeft,
                background: "var(--accent)",
                boxShadow: "0 0 0 4px var(--bg), 0 0 0 5px var(--line)",
              }}
            />
            <div
              className="absolute top-[19px] overflow-hidden text-ellipsis whitespace-nowrap text-[11.5px] font-medium tabular-nums tracking-[0.01em]"
              style={{
                left: `calc(${dotLeft} + 18px)`,
                maxWidth: `calc(${rail} - 30px)`,
                color: "var(--fg)",
              }}
            >
              {item.title}
            </div>
            <div className="w-full">{item.content}</div>
          </div>
        ))}
        <div
          style={{ height: height + "px" }}
          className="absolute left-[clamp(4px,1vw,10px)] top-0 w-[3px]"
        >
          <div className="absolute inset-0 rounded-full" style={{ background: "var(--line)" }} />
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
              background: "linear-gradient(to bottom, var(--accent), transparent)",
              boxShadow: "0 0 14px 3px var(--accent), 0 0 4px 1px var(--accent)",
              clipPath:
                "polygon(0 0, 100% 0, 100% calc(100% - 18px), 50% 100%, 0 calc(100% - 18px))",
              WebkitClipPath:
                "polygon(0 0, 100% 0, 100% calc(100% - 18px), 50% 100%, 0 calc(100% - 18px))",
            }}
            className="absolute inset-x-0 top-0 w-full"
          />
        </div>
      </div>
    </div>
  );
};
