"use client";

import { ScrollProgress } from "@/components/motion-primitives/scroll-progress";

export function ScrollProgressBar() {
  return (
    <ScrollProgress
      className="bg-[linear-gradient(90deg,var(--accent),oklch(0.75_0.16_180))]"
      springOptions={{ stiffness: 260, damping: 40 }}
    />
  );
}
