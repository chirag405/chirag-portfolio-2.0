"use client";

import { useRef, useState } from "react";

import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Retheme of Aceternity's Direction Aware Hover (https://ui.aceternity.com) —
 * the stock version hides `children` entirely until hover (opacity 0 → 1),
 * which doesn't work for a project grid that needs to read on touch devices
 * with no hover at all. Text (and a base scrim, for legibility over any
 * photo) is visible by default here; hover only adds the directional image
 * pan and deepens the scrim slightly, as a bonus interaction, not the reveal
 * mechanism itself.
 */
export const DirectionAwareHover = ({
  imageUrl,
  children,
  childrenClassName,
  imageClassName,
  className,
}: {
  imageUrl: string;
  children: React.ReactNode | string;
  childrenClassName?: string;
  imageClassName?: string;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [direction, setDirection] = useState<
    "top" | "bottom" | "left" | "right" | string
  >("left");

  const handleMouseEnter = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!ref.current) return;

    const direction = getDirection(event, ref.current);
    switch (direction) {
      case 0:
        setDirection("top");
        break;
      case 1:
        setDirection("right");
        break;
      case 2:
        setDirection("bottom");
        break;
      case 3:
        setDirection("left");
        break;
      default:
        setDirection("left");
        break;
    }
  };

  const getDirection = (
    ev: React.MouseEvent<HTMLDivElement, MouseEvent>,
    obj: HTMLElement
  ) => {
    const { width: w, height: h, left, top } = obj.getBoundingClientRect();
    const x = ev.clientX - left - (w / 2) * (w > h ? h / w : 1);
    const y = ev.clientY - top - (h / 2) * (h > w ? w / h : 1);
    const d = Math.round(Math.atan2(y, x) / 1.57079633 + 5) % 4;
    return d;
  };

  return (
    <motion.div
      onMouseEnter={handleMouseEnter}
      ref={ref}
      className={cn(
        "group/card relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-transparent",
        className
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          className="relative h-full w-full"
          initial="initial"
          whileHover={direction}
          exit="exit"
        >
          <motion.div
            className="absolute inset-0 z-10 h-full w-full transition duration-500"
            style={{ background: "rgba(6,6,8,0.42)" }}
          />
          <motion.div
            className="absolute inset-0 z-10 h-full w-full opacity-0 transition duration-500 group-hover/card:opacity-100"
            style={{ background: "rgba(6,6,8,0.28)" }}
          />
          <motion.div
            variants={variants}
            className="relative h-full w-full"
            style={{ background: "var(--card)" }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
          >
            <img
              alt=""
              className={cn(
                "h-full w-full scale-[1.1] object-cover object-top",
                imageClassName
              )}
              width="1000"
              height="1000"
              src={imageUrl}
            />
          </motion.div>
          <div className={cn("absolute inset-0 z-40 flex flex-col justify-end", childrenClassName)}>
            {children}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

const variants = {
  initial: {
    x: 0,
  },

  exit: {
    x: 0,
    y: 0,
  },
  top: {
    y: 20,
  },
  bottom: {
    y: -20,
  },
  left: {
    x: 20,
  },
  right: {
    x: -20,
  },
};
