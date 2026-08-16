"use client";

export function LangBar({ languages }: { languages: { name: string; pct: number }[] }) {
  const hues: Record<string, number> = {};
  const palette = [258, 210, 170, 30, 340];
  languages.forEach((l, i) => (hues[l.name] = palette[i % palette.length]));

  return (
    <div>
      <div className="mb-3 flex h-2 w-full gap-0.5 overflow-hidden">
        {languages.map((l) => (
          <div
            key={l.name}
            style={{ width: `${l.pct}%`, background: `oklch(.6 .18 ${hues[l.name]})` }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {languages.map((l) => (
          <div key={l.name} className="flex items-center gap-1.5 text-[11.5px] text-[color:var(--muted)]">
            <span className="h-1.5 w-1.5" style={{ background: `oklch(.6 .18 ${hues[l.name]})` }} />
            <span className="text-[color:var(--fg)]">{l.name}</span>
            <span>{l.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Donut({ easy, medium, hard }: { easy: number; medium: number; hard: number }) {
  const total = Math.max(1, easy + medium + hard);
  const R = 34;
  const C = 2 * Math.PI * R;
  const segs = [
    { v: easy, c: "oklch(.72 .15 165)" },
    { v: medium, c: "oklch(.75 .15 75)" },
    { v: hard, c: "oklch(.62 .21 25)" },
  ];
  let off = 0;
  return (
    <svg viewBox="0 0 88 88" style={{ width: 92, height: 92, flex: "none" }}>
      <circle cx={44} cy={44} r={R} fill="none" stroke="var(--line2)" strokeWidth={9} />
      {segs.map((s, i) => {
        const len = C * (s.v / total);
        const el = (
          <circle
            key={i}
            cx={44}
            cy={44}
            r={R}
            fill="none"
            stroke={s.c}
            strokeWidth={9}
            strokeDasharray={`${len} ${C - len}`}
            strokeDashoffset={-off}
            transform="rotate(-90 44 44)"
          />
        );
        off += len;
        return el;
      })}
      <text x={44} y={41} textAnchor="middle" style={{ font: "400 20px var(--font-serif), serif", fill: "var(--fg)" }}>
        {easy + medium + hard}
      </text>
      <text x={44} y={56} textAnchor="middle" style={{ font: "400 8.5px var(--font-mono), monospace", fill: "var(--muted)" }}>
        solved
      </text>
    </svg>
  );
}

export function Spark({ data }: { data: number[] }) {
  if (data.length < 2 || data.every((v) => v === 0)) {
    return <div className="h-9 w-full" style={{ background: "var(--line2)" }} />;
  }
  const w = 100;
  const h = 30;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`).join(" ");
  const area = `0,${h} ${pts} ${w},${h}`;
  const lastY = h - ((data[data.length - 1] - min) / range) * (h - 4) - 2;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: "100%", height: 36, display: "block" }}>
      <polygon points={area} fill="var(--accent-weak)" />
      <polyline points={pts} fill="none" stroke="var(--accent)" strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
      <circle cx={w} cy={lastY} r={1.8} fill="var(--accent)" />
    </svg>
  );
}

export function ContribGrid({ calendar }: { calendar: number[][] | null }) {
  const days = 7;
  const cell = 11;
  const gap = 3;
  const weeks = calendar?.length ?? 52;

  const levelFor = (w: number, d: number): number => {
    if (calendar) {
      const count = calendar[w]?.[d] ?? 0;
      if (count === 0) return 0;
      if (count >= 8) return 4;
      if (count >= 5) return 3;
      if (count >= 2) return 2;
      return 1;
    }
    // No real per-day data available (no GITHUB_TOKEN) — deterministic decorative texture.
    const x = Math.sin(w * 99.7 + d * 57.3) * 10000;
    const r = x - Math.floor(x);
    return r > 0.82 ? 4 : r > 0.66 ? 3 : r > 0.45 ? 2 : r > 0.24 ? 1 : 0;
  };

  const cells: React.ReactNode[] = [];
  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < days; d++) {
      const lvl = levelFor(w, d);
      const alpha = [0.06, 0.28, 0.5, 0.72, 1][lvl];
      cells.push(
        <rect
          key={`${w}-${d}`}
          x={w * (cell + gap)}
          y={d * (cell + gap)}
          width={cell}
          height={cell}
          rx={1.5}
          fill={lvl === 0 ? "var(--line2)" : `color-mix(in oklch, var(--accent) ${alpha * 100}%, transparent)`}
        />
      );
    }
  }
  const W = weeks * (cell + gap);
  const H = days * (cell + gap);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", maxWidth: W, display: "block" }} preserveAspectRatio="xMinYMin meet">
      {cells}
    </svg>
  );
}
