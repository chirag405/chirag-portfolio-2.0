"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const KEY_SOUNDS_DOWN: Record<string, [number, number]> = {
  A: [31542, 85],
  B: [40621, 107],
  C: [39632, 95],
  D: [32492, 85],
  E: [23317, 83],
  F: [32973, 87],
  G: [33453, 94],
  H: [33986, 93],
  I: [25795, 91],
  J: [34425, 88],
  K: [34932, 90],
  L: [35410, 95],
  M: [41610, 93],
  N: [41103, 90],
  O: [26309, 84],
  P: [26804, 83],
  Q: [22245, 95],
  R: [23817, 92],
  S: [32031, 88],
  T: [24297, 92],
  U: [25313, 95],
  V: [40136, 94],
  W: [22790, 89],
  X: [39148, 76],
  Y: [24811, 93],
  Z: [38694, 80],
  " ": [51541, 144],
  "-": [42594, 90],
  "@": [23317, 83],
  "/": [42594, 90],
  ".": [42594, 90],
  ":": [42594, 90],
  "0": [26309, 84],
  "1": [25313, 95],
  "2": [23317, 83],
  "3": [23817, 92],
  "4": [24297, 92],
  "5": [24811, 93],
  "6": [25313, 95],
  "7": [25795, 91],
  "8": [26309, 84],
  "9": [26804, 83],
  Enter: [19065, 110],
};

const KEY_SOUNDS_UP: Record<string, [number, number]> = {
  A: [31632, 80],
  B: [40736, 95],
  C: [39732, 85],
  D: [32577, 80],
  E: [23402, 80],
  F: [33063, 80],
  G: [33553, 85],
  H: [34081, 85],
  I: [25890, 85],
  J: [34515, 85],
  K: [35027, 85],
  L: [35510, 85],
  M: [41710, 85],
  N: [41198, 85],
  O: [26394, 80],
  P: [26889, 80],
  Q: [22345, 85],
  R: [23912, 85],
  S: [32121, 80],
  T: [24392, 85],
  U: [25413, 85],
  V: [40236, 85],
  W: [22880, 85],
  X: [39228, 70],
  Y: [24911, 85],
  Z: [38779, 75],
  " ": [51691, 130],
  "-": [42689, 85],
  "@": [23402, 80],
  "/": [42689, 85],
  ".": [42689, 85],
  ":": [42689, 85],
  "0": [26394, 80],
  "1": [25413, 85],
  "2": [23402, 80],
  "3": [23912, 85],
  "4": [24392, 85],
  "5": [24911, 85],
  "6": [25413, 85],
  "7": [25890, 85],
  "8": [26394, 80],
  "9": [26889, 80],
  Enter: [19180, 100],
};

function useAudio(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const readyRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    const init = async () => {
      try {
        ctxRef.current = new AudioContext();
        const res = await fetch("/sounds/sound.ogg");
        if (!res.ok) return;
        bufferRef.current = await ctxRef.current.decodeAudioData(
          await res.arrayBuffer(),
        );
        readyRef.current = true;
      } catch {}
    };
    init();
    return () => {
      ctxRef.current?.close();
    };
  }, [enabled]);

  const playSound = (sound: [number, number] | undefined) => {
    if (!readyRef.current || !ctxRef.current || !bufferRef.current || !sound)
      return;
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    const src = ctxRef.current.createBufferSource();
    src.buffer = bufferRef.current;
    src.connect(ctxRef.current.destination);
    src.start(0, sound[0] / 1000, sound[1] / 1000);
  };

  const down = (key: string) =>
    playSound(KEY_SOUNDS_DOWN[key.toUpperCase()] || KEY_SOUNDS_DOWN[key]);
  const up = (key: string) =>
    playSound(KEY_SOUNDS_UP[key.toUpperCase()] || KEY_SOUNDS_UP[key]);

  return { down, up };
}

function useInView(ref: React.RefObject<HTMLElement | null>, once = true) {
  const [inView, setInView] = useState(false);
  const triggered = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || (once && triggered.current)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          setInView(true);
          if (once) {
            triggered.current = true;
            observer.disconnect();
          }
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, once]);

  return inView;
}

type TokenType =
  | "command"
  | "flag"
  | "string"
  | "number"
  | "operator"
  | "path"
  | "variable"
  | "comment"
  | "default";

interface Token {
  type: TokenType;
  value: string;
}

function tokenizeBash(text: string): Token[] {
  const tokens: Token[] = [];
  const words = text.split(/(\s+)/);

  let isFirstWord = true;

  for (const word of words) {
    if (/^\s+$/.test(word)) {
      tokens.push({ type: "default", value: word });
      continue;
    }

    if (word.startsWith("#")) {
      tokens.push({ type: "comment", value: word });
      continue;
    }

    if (word.startsWith("$")) {
      tokens.push({ type: "variable", value: word });
      isFirstWord = false;
      continue;
    }

    if (word.startsWith("--") || word.startsWith("-")) {
      tokens.push({ type: "flag", value: word });
      isFirstWord = false;
      continue;
    }

    if (/^["'].*["']$/.test(word)) {
      tokens.push({ type: "string", value: word });
      isFirstWord = false;
      continue;
    }

    if (/^\d+$/.test(word)) {
      tokens.push({ type: "number", value: word });
      isFirstWord = false;
      continue;
    }

    if (/^[|>&<]+$/.test(word)) {
      tokens.push({ type: "operator", value: word });
      isFirstWord = true;
      continue;
    }

    if (word.includes("/") || word.startsWith(".") || word.startsWith("~")) {
      tokens.push({ type: "path", value: word });
      isFirstWord = false;
      continue;
    }

    if (isFirstWord) {
      tokens.push({ type: "command", value: word });
      isFirstWord = false;
      continue;
    }

    tokens.push({ type: "default", value: word });
  }

  return tokens;
}

const tokenColors: Record<TokenType, string> = {
  command: "text-[color:var(--accent)]",
  flag: "text-[color:var(--muted)]",
  string: "text-[color:var(--fg)]",
  number: "text-[color:var(--accent)]",
  operator: "text-[color:var(--faint)]",
  path: "text-[color:var(--muted)]",
  variable: "text-[color:var(--accent)]",
  comment: "text-[color:var(--faint)]",
  default: "text-[color:var(--fg)]",
};

function SyntaxHighlightedText({ text }: { text: string }) {
  const tokens = tokenizeBash(text);

  return (
    <>
      {tokens.map((token, i) => (
        <span key={i} className={tokenColors[token.type]}>
          {token.value}
        </span>
      ))}
    </>
  );
}

interface TerminalLine {
  type: "command" | "output";
  content: string;
}

export interface TerminalProps {
  commands: string[];
  outputs?: Record<number, string[]>;
  username?: string;
  /** Full override for the title-bar label (defaults to "{username} — bash"). */
  title?: string;
  /** "userhost" shows "user:~$"; "bare" shows a plain "$ " prompt. */
  promptStyle?: "userhost" | "bare";
  className?: string;
  typingSpeed?: number;
  delayBetweenCommands?: number;
  initialDelay?: number;
  enableSound?: boolean;
  /**
   * When set, the terminal becomes typeable once the scripted intro
   * finishes: a real input line appears, Enter submits, and this resolves
   * the response lines to print (async — e.g. a fetch to a chat API).
   * Throw or resolve ["..."] with an error message to surface a failure.
   */
  onCommand?: (command: string) => Promise<string[]> | string[];
  inputPlaceholder?: string;
}

export function Terminal({
  commands = ["npx shadcn@latest init"],
  outputs = {},
  username = "Manus-Macbook",
  title,
  promptStyle = "userhost",
  className,
  typingSpeed = 50,
  delayBetweenCommands = 800,
  initialDelay = 500,
  enableSound = true,
  onCommand,
  inputPlaceholder,
}: TerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inView = useInView(containerRef);
  const { down, up } = useAudio(enableSound);

  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentText, setCurrentText] = useState("");
  const [commandIdx, setCommandIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [outputIdx, setOutputIdx] = useState(-1);
  const [phase, setPhase] = useState<
    "idle" | "typing" | "executing" | "outputting" | "pausing" | "done"
  >("idle");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [liveInput, setLiveInput] = useState("");
  const [busy, setBusy] = useState(false);

  const currentCommand = commands[commandIdx] || "";
  const currentOutputs = useMemo(
    () => outputs[commandIdx] || [],
    [outputs, commandIdx],
  );
  const isLastCommand = commandIdx === commands.length - 1;

  useEffect(() => {
    if (!inView || phase !== "idle") return;
    const t = setTimeout(() => setPhase("typing"), initialDelay);
    return () => clearTimeout(t);
  }, [inView, phase, initialDelay]);

  useEffect(() => {
    if (phase !== "typing") return;

    if (charIdx < currentCommand.length) {
      const char = currentCommand[charIdx];
      down(char);
      const t = setTimeout(
        () => {
          up(char);
          setCurrentText(currentCommand.slice(0, charIdx + 1));
          setCharIdx((c) => c + 1);
        },
        typingSpeed + Math.random() * 30,
      );
      return () => clearTimeout(t);
    } else {
      down("Enter");
      const t = setTimeout(() => {
        up("Enter");
        setPhase("executing");
      }, 80);
      return () => clearTimeout(t);
    }
  }, [phase, charIdx, currentCommand, typingSpeed, down, up]);

  useEffect(() => {
    if (phase !== "executing") return;

    // Phase-machine transition (typing -> executing -> outputting/pausing),
    // not a derived/cascading update — each phase change commits one step
    // of the scripted terminal animation.
    setLines((prev) => [...prev, { type: "command", content: currentCommand }]);
    setCurrentText("");

    if (currentOutputs.length > 0) {
      setOutputIdx(0);
      setPhase("outputting");
    } else if (isLastCommand) {
      setPhase("done");
    } else {
      setPhase("pausing");
    }
  }, [phase, currentCommand, currentOutputs.length, isLastCommand]);

  useEffect(() => {
    if (phase !== "outputting") return;

    if (outputIdx >= 0 && outputIdx < currentOutputs.length) {
      const t = setTimeout(() => {
        setLines((prev) => [
          ...prev,
          { type: "output", content: currentOutputs[outputIdx] },
        ]);
        setOutputIdx((i) => i + 1);
      }, 150);
      return () => clearTimeout(t);
    } else if (outputIdx >= currentOutputs.length) {
      const t = setTimeout(() => {
        if (isLastCommand) {
          setPhase("done");
        } else {
          setPhase("pausing");
        }
      }, 300);
      return () => clearTimeout(t);
    }
  }, [phase, outputIdx, currentOutputs, isLastCommand]);

  useEffect(() => {
    if (phase !== "pausing") return;
    const t = setTimeout(() => {
      setCharIdx(0);
      setOutputIdx(-1);
      setCommandIdx((c) => c + 1);
      setPhase("typing");
    }, delayBetweenCommands);
    return () => clearTimeout(t);
  }, [phase, delayBetweenCommands]);

  useEffect(() => {
    const interval = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [lines, phase, liveInput, busy]);

  const isInteractive = phase === "done" && Boolean(onCommand);

  useEffect(() => {
    if (isInteractive && !busy) inputRef.current?.focus();
  }, [isInteractive, busy]);

  const focusInput = () => {
    if (isInteractive) inputRef.current?.focus();
  };

  const submitCommand = async () => {
    const cmd = liveInput.trim();
    if (!cmd || busy || !onCommand) return;
    if (cmd.toLowerCase() === "clear") {
      setLines([]);
      setLiveInput("");
      return;
    }
    setLines((prev) => [...prev, { type: "command", content: cmd }]);
    setLiveInput("");
    setBusy(true);
    try {
      const result = await onCommand(cmd);
      setLines((prev) => [...prev, ...result.map((content) => ({ type: "output" as const, content }))]);
    } catch (err) {
      setLines((prev) => [
        ...prev,
        { type: "output", content: err instanceof Error ? err.message : "command failed" },
      ]);
    } finally {
      setBusy(false);
    }
  };

  const prompt =
    promptStyle === "bare" ? (
      <span style={{ color: "var(--accent)" }}>$ </span>
    ) : (
      <span style={{ color: "var(--faint)" }}>
        <span style={{ color: "var(--accent)" }}>{username}</span>
        <span>:</span>
        <span style={{ color: "var(--accent)" }}>~</span>
        <span>$</span>{" "}
      </span>
    );

  return (
    <div
      ref={containerRef}
      className={cn("w-full font-mono text-xs", className)}
    >
      <div
        className="overflow-hidden border"
        style={{ borderColor: "var(--line)", background: "var(--card)" }}
      >
        {/* Title Bar */}
        <div
          className="flex items-center gap-[7px] border-b px-3 py-[9px]"
          style={{ borderColor: "var(--line2)" }}
        >
          <span className="h-[9px] w-[9px] rounded-full" style={{ background: "var(--line)" }} />
          <span className="h-[9px] w-[9px] rounded-full" style={{ background: "var(--line)" }} />
          <span className="h-[9px] w-[9px] rounded-full" style={{ background: "var(--line)" }} />
          <span className="ml-1.5 truncate text-[11px]" style={{ color: "var(--faint)" }}>
            {title ?? `${username} — bash`}
          </span>
        </div>

        {/* Terminal Content */}
        <div
          ref={contentRef}
          onClick={focusInput}
          className={cn(
            "no-visible-scrollbar h-64 overflow-y-auto px-4 pb-[18px] pt-4 font-mono text-[12.5px] leading-[1.85]",
            isInteractive && "cursor-text",
          )}
        >
          {lines.map((line, i) => (
            <div key={i} className="whitespace-pre-wrap">
              {line.type === "command" ? (
                <span>
                  {prompt}
                  <SyntaxHighlightedText text={line.content} />
                </span>
              ) : (
                <span style={{ color: "var(--muted)" }}>{line.content}</span>
              )}
            </div>
          ))}

          {phase === "typing" && (
            <div className="whitespace-pre-wrap">
              {prompt}
              <SyntaxHighlightedText text={currentText} />
              <span
                className="ml-0.5 inline-block h-[14px] w-[7px] align-[-2px]"
                style={{ background: "var(--accent)" }}
              />
            </div>
          )}

          {(phase === "done" ||
            phase === "pausing" ||
            phase === "outputting") &&
            !isInteractive && (
              <div className="whitespace-pre-wrap">
                {prompt}
                <span
                  className={cn(
                    "inline-block h-[14px] w-[7px] align-[-2px] transition-opacity duration-100",
                    !cursorVisible && "opacity-0",
                  )}
                  style={{ background: "var(--accent)" }}
                />
              </div>
            )}

          {isInteractive && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitCommand();
              }}
              className="flex items-center whitespace-pre-wrap"
            >
              {prompt}
              <input
                ref={inputRef}
                value={liveInput}
                disabled={busy}
                onChange={(e) => setLiveInput(e.target.value)}
                onKeyDown={(e) => {
                  const key = e.key.length === 1 ? e.key : e.key === "Backspace" ? "Backspace" : null;
                  if (key) down(key === "Backspace" ? " " : key);
                }}
                onKeyUp={(e) => {
                  const key = e.key.length === 1 ? e.key : e.key === "Backspace" ? "Backspace" : null;
                  if (key) up(key === "Backspace" ? " " : key);
                }}
                placeholder={busy ? "" : inputPlaceholder}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                className="min-w-0 flex-1 border-none bg-transparent font-mono text-[12.5px] outline-none"
                style={{ color: "var(--fg)", caretColor: "var(--accent)" }}
              />
              {busy && (
                <span style={{ color: "var(--faint)" }}>
                  thinking<span style={{ animation: "blink 1s step-end infinite" }}>…</span>
                </span>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
