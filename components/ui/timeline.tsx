"use client";
import { useScroll, useTransform, motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";

export interface TimelineEntry {
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

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref, data]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 15%", "end 60%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="w-full" ref={containerRef}>
      <div ref={ref} className="relative pl-[clamp(20px,4vw,44px)]">
        {data.map((item, index) => (
          <div key={index} className="relative mb-3.5 flex gap-4">
            <div
              className="absolute top-[26px] h-[9px] w-[9px] flex-none rounded-full"
              style={{
                left: "calc(-1 * clamp(20px,4vw,44px) + clamp(1px,1vw,7px))",
                background: "var(--accent)",
                boxShadow: "0 0 0 4px var(--bg), 0 0 0 5px var(--line)",
              }}
            />
            <div className="w-full">{item.content}</div>
          </div>
        ))}
        <div
          style={{ height: height + "px" }}
          className="absolute left-[clamp(4px,1vw,10px)] top-0 w-px overflow-hidden"
        >
          <div className="absolute inset-0" style={{ background: "var(--line)" }} />
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
              background: "linear-gradient(to bottom, var(--accent), transparent)",
            }}
            className="absolute inset-x-0 top-0 w-full rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
