"use client";
import { cn } from "@/lib/utils";
import { motion, SpringOptions, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";

// Pre-created at module scope (not inside the component) so render never
// calls motion.create() itself — satisfies react-hooks/static-components,
// which flags component factories invoked from a render path.
const motionComponents = {
  span: motion.create("span"),
  div: motion.create("div"),
  p: motion.create("p"),
};
type MotionTag = keyof typeof motionComponents;

export type AnimatedNumberProps = {
  value: number;
  className?: string;
  springOptions?: SpringOptions;
  as?: MotionTag;
  format?: (value: number) => string;
};

export function AnimatedNumber({
  value,
  className,
  springOptions,
  as = "span",
  format,
}: AnimatedNumberProps) {
  const MotionComponent = motionComponents[as];

  const spring = useSpring(value, springOptions);
  const display = useTransform(spring, (current) =>
    format ? format(current) : Math.round(current).toLocaleString()
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return (
    <MotionComponent className={cn("tabular-nums", className)}>
      {display}
    </MotionComponent>
  );
}
