"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { Magnetic } from "@/components/motion-primitives/magnetic";

type ChatMessage = { from: "user" | "bot"; text: string };

function PetIcon() {
  // 9x9 pixel-pet, ported from the original design's petMatrix.
  const matrix = [
    "....a....",
    "....k....",
    "..ccccc..",
    ".ccwwwcc.",
    ".cwakawc.",
    ".cwwwwwc.",
    ".cwkkkwc.",
    ".ccwwwcc.",
    "..cc.cc..",
  ];
  const colors: Record<string, string> = {
    c: "var(--fg)",
    w: "var(--bg)",
    k: "var(--fg)",
    a: "var(--accent)",
  };
  const cell = 5;
  const rects: React.ReactNode[] = [];
  matrix.forEach((row, y) => {
    row.split("").forEach((ch, x) => {
      if (ch === ".") return;
      rects.push(
        <rect key={`${x}-${y}`} x={x * cell} y={y * cell} width={cell} height={cell} fill={colors[ch]} />
      );
    });
  });
  return (
    <svg
      viewBox={`0 0 ${9 * cell} ${9 * cell}`}
      style={{ width: 44, height: 44, imageRendering: "pixelated", shapeRendering: "crispEdges" }}
    >
      {rects}
    </svg>
  );
}

export function ChatWidget() {
  const t = useTranslations("chat");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ from: "bot", text: t("greeting") }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const show = setTimeout(() => setHint(true), 2600);
    const hide = setTimeout(() => setHint(false), 6800);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight + 999;
  }, [messages, typing]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    const history = messages.slice(-6).map((m) => ({
      role: m.from === "user" ? ("user" as const) : ("assistant" as const),
      content: m.text,
    }));
    setMessages((prev) => [...prev, { from: "user", text: trimmed }]);
    setInput("");
    setTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history, locale }),
      });
      if (!res.body) throw new Error("no body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      setMessages((prev) => [...prev, { from: "bot", text: "" }]);
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { from: "bot", text: acc };
          return next;
        });
      }
    } catch {
      setMessages((prev) => [...prev, { from: "bot", text: "Couldn't reach the assistant — try again in a moment." }]);
    } finally {
      setTyping(false);
    }
  };

  const suggestions = [
    { label: t("suggestExperience"), q: "experience" },
    { label: t("suggestProjects"), q: "projects" },
    { label: t("suggestStack"), q: "stack" },
  ];

  return (
    <div className="fixed bottom-[clamp(16px,3vw,28px)] right-[clamp(16px,3vw,28px)] z-[60] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.985 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex h-[440px] w-[min(340px,86vw)] flex-col border shadow-[0_12px_40px_-12px_rgba(10,10,10,.18)]"
            style={{ borderColor: "var(--line)", background: "var(--card)" }}
          >
            <div className="flex items-center justify-between border-b px-3.5 py-3" style={{ borderColor: "var(--line2)" }}>
              <div className="flex items-center gap-2 text-[12.5px]">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: "var(--accent)", animation: "pulse 2.4s ease-in-out infinite" }}
                />
                {t("title")}
              </div>
              <button
                onClick={() => setOpen(false)}
                data-cursor="close"
                aria-label={t("close")}
                className="border-none bg-transparent px-1.5 py-0.5 text-sm text-[color:var(--muted)]"
              >
                ✕
              </button>
            </div>
            <div ref={scrollRef} className="flex flex-1 flex-col gap-3 overflow-y-auto p-3.5 text-[12.5px] leading-[1.55]">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className="max-w-[82%] whitespace-pre-wrap border px-2.5 py-2"
                  style={{
                    alignSelf: m.from === "user" ? "flex-end" : "flex-start",
                    background: m.from === "user" ? "var(--accent-weak)" : "transparent",
                    borderColor: m.from === "user" ? "var(--accent)" : "var(--line)",
                    color: m.from === "user" ? "var(--fg)" : "var(--muted)",
                  }}
                >
                  {m.text}
                </div>
              ))}
              {typing && (
                <div className="self-start text-xs text-[color:var(--faint)]">
                  {t("thinking")}
                  <span style={{ animation: "blink 1s step-end infinite" }}>…</span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 px-3.5 pb-2.5">
              {suggestions.map((s) => (
                <button
                  key={s.q}
                  onClick={() => send(s.q)}
                  className="border px-2 py-1 text-[10.5px] text-[color:var(--muted)]"
                  style={{ borderColor: "var(--line)", background: "none" }}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex gap-2 border-t px-3 py-2.5"
              style={{ borderColor: "var(--line2)" }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("placeholder")}
                className="min-w-0 flex-1 border-none bg-transparent text-[12.5px] text-[color:var(--fg)] outline-none"
              />
              <button
                type="submit"
                className="border px-2.5 py-1 text-xs"
                style={{ borderColor: "var(--accent)", color: "var(--accent)", background: "none" }}
              >
                ↵
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-end gap-2">
        <AnimatePresence>
          {hint && !open && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="mb-3.5 whitespace-nowrap border px-2.5 py-1.5 text-[11px] shadow-[0_6px_20px_-10px_rgba(10,10,10,.25)]"
              style={{ borderColor: "var(--line)", background: "var(--card)", color: "var(--fg)" }}
            >
              {t("hint")}
            </motion.div>
          )}
        </AnimatePresence>
        <Magnetic range={80} intensity={0.25}>
          <button
            onClick={() => setOpen((v) => !v)}
            data-cursor="chat"
            title={t("hint")}
            className="border-none bg-transparent p-0 leading-none"
            style={{ filter: "drop-shadow(0 6px 14px rgba(10,10,10,.18))" }}
          >
            <span style={{ display: "inline-block", animation: "bob 2.6s ease-in-out infinite" }}>
              <PetIcon />
            </span>
          </button>
        </Magnetic>
      </div>
    </div>
  );
}
