"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { Cursor } from "@/components/motion-primitives/cursor";

const LABELS = ["view", "open", "download", "expand", "chat", "close", "drag", "select", "toggle"] as const;

function subscribeFinePointer(callback: () => void) {
  const mq = window.matchMedia("(pointer: fine)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}
function getFinePointerSnapshot() {
  return window.matchMedia("(pointer: fine)").matches;
}
function getFinePointerServerSnapshot() {
  return false;
}

export function SiteCursor() {
  const t = useTranslations("cursor");
  const prefersReducedMotion = useReducedMotion();
  const isFinePointer = useSyncExternalStore(
    subscribeFinePointer,
    getFinePointerSnapshot,
    getFinePointerServerSnapshot
  );
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!isFinePointer) return;
    const onMove = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest?.("[data-cursor]");
      const key = target?.getAttribute("data-cursor") ?? null;
      setLabel(key);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [isFinePointer]);

  if (!isFinePointer || prefersReducedMotion) return null;

  const hasLabel = label !== null && (LABELS as readonly string[]).includes(label);

  return (
    <Cursor springConfig={{ stiffness: 900, damping: 50, mass: 0.35 }}>
      <div
        className="flex items-center justify-center overflow-hidden whitespace-nowrap rounded-full border text-[11px] tracking-[0.02em] transition-[width,height,padding,background-color,color] duration-200 ease-out"
        style={{
          width: hasLabel ? "auto" : 14,
          height: hasLabel ? 26 : 14,
          padding: hasLabel ? "0 12px" : 0,
          background: hasLabel ? "var(--accent)" : "var(--accent-weak)",
          borderColor: "var(--accent)",
          color: hasLabel ? "var(--bg)" : "var(--fg)",
        }}
      >
        {hasLabel ? t(label as (typeof LABELS)[number]) : null}
      </div>
    </Cursor>
  );
}
