"use client";

import { useState, useMemo, type FC, type ChangeEvent, type CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface ColorSettings {
  text: string;
  gradient: string;
}

export interface AdaptiveSliderProps {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  label?: string;
  unit?: string;
  formatValue?: (value: number) => string;
  getColor?: (value: number, min: number, max: number) => ColorSettings;
  /** Static full-width track background (e.g. a fixed rainbow strip for a hue picker). Disables the animated fill bar when set. */
  trackBackground?: string;
  onChange?: (value: number) => void;
}

const DEFAULT_MIN = 50;
const DEFAULT_MAX = 350;
const DEFAULT_STEP = 25;
const DEFAULT_VALUE = 200;

const defaultGetColor = (value: number, min: number, max: number): ColorSettings => {
  const percentage = (value - min) / (max - min);
  if (percentage < 0.5) {
    return { text: "#10B981", gradient: "linear-gradient(to right, #FEB101, #FE7C09)" };
  } else if (percentage < 0.7) {
    return { text: "#FE55B7", gradient: "linear-gradient(to right, #FE55B74D, #FE55B7)" };
  }
  return { text: "#D946EF", gradient: "linear-gradient(to right, #DAB0FE, #4946FF)" };
};

export const AdaptiveSlider: FC<AdaptiveSliderProps> = ({
  value,
  min = DEFAULT_MIN,
  max = DEFAULT_MAX,
  step = DEFAULT_STEP,
  defaultValue = DEFAULT_VALUE,
  label = "Calories",
  unit = "kCal",
  formatValue,
  getColor = defaultGetColor,
  trackBackground,
  onChange,
}) => {
  const [internalValue, setInternalValue] = useState<number>(defaultValue);

  const current = value ?? internalValue;

  const colorSettings = useMemo(() => getColor(current, min, max), [current, min, max, getColor]);

  const percentage = ((current - min) / (max - min)) * 100;

  const dots = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="z-30 h-1.5 w-1.5 rounded-full"
          style={{ opacity: 0.8, background: trackBackground ? "rgba(255,255,255,.8)" : "var(--line)" }}
        />
      )),
    [trackBackground]
  );

  const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setInternalValue(val);
    onChange?.(val);
  };

  const displayValue = formatValue ? formatValue(current) : current.toString();

  return (
    <motion.div
      className="flex w-[260px] flex-col items-center rounded-[24px] p-5 shadow-2xl shadow-black/10 select-none"
      style={{ background: "var(--card)", border: "1px solid var(--line)" }}
    >
      <span
        className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.1em]"
        style={{ color: "var(--muted)" }}
      >
        {label}
      </span>

      <div className="mb-5 flex items-baseline gap-1.5">
        <AnimatedText
          value={displayValue}
          className="text-3xl font-bold tracking-tight"
          style={{ color: colorSettings.text }}
        />
        <motion.span layout className="text-lg font-semibold" style={{ color: "var(--fg)" }}>
          {unit}
        </motion.span>
      </div>

      <div
        className="group relative flex h-10 w-full items-center overflow-hidden rounded-full"
        style={{ background: trackBackground ?? "var(--line2)" }}
      >
        <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-3.5">
          {dots}
        </div>

        {!trackBackground && (
          <motion.div
            className="pointer-events-none absolute top-0 left-0 h-full rounded-full"
            animate={{
              width: `calc((${percentage} / 100) * (100% - 40px) + 40px)`,
              background: colorSettings.gradient,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}

        <input
          title={label}
          type="range"
          min={min}
          max={max}
          step={step}
          value={current}
          onChange={handleSliderChange}
          className="absolute inset-0 z-50 h-10 w-full cursor-pointer opacity-0"
        />

        <motion.div
          className="pointer-events-none absolute top-0 z-40 flex size-10 items-center justify-center"
          animate={{ left: `calc((${percentage} / 100) * (100% - 40px))` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div
            className="size-7 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
            style={{ background: "#fff", border: `2px solid ${colorSettings.text}` }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

const AnimatedText = ({
  value,
  className,
  style,
}: {
  value: string;
  className?: string;
  style?: CSSProperties;
}) => {
  return (
    <div className={cn("flex text-lg tracking-tight will-change-transform", className)} style={style}>
      <AnimatePresence mode="popLayout" initial={false}>
        {value.split("").map((char, index) => {
          const displayChar = char === " " ? " " : char;
          return (
            <motion.span
              key={char + index}
              initial={{ opacity: 1, y: 0, scale: 1 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { type: "spring", stiffness: 200, damping: 20 },
              }}
              exit={{ opacity: 0, y: 0, scale: 1, transition: { duration: 0 } }}
            >
              {displayChar}
            </motion.span>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
