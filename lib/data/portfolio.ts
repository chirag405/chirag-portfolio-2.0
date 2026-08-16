export type Experience = {
  id: string;
  period: string;
  title: string;
  org: string;
  summary: string;
  details: string[];
  stack: string[];
};

export const experiences: Experience[] = [
  {
    id: "incerro",
    period: "2024 — present",
    title: "Associate GenAI & Full-Stack Engineer",
    org: "@ Incerro",
    summary:
      "Building and shipping GenAI features end-to-end — retrieval, model serving, and the full-stack surfaces around them.",
    details: [
      "Owned RAG pipeline: retrieval → reranking → eval gating before responses ship",
      "Model serving on vLLM / Triton under explicit latency budgets",
      "Full-stack surfaces in Next.js + FastAPI, prompt/version tooling",
    ],
    stack: ["Python", "vLLM", "FastAPI", "Next.js", "Postgres"],
  },
  {
    id: "flutter",
    period: "2020 — 2024",
    title: "Flutter Developer",
    org: "· internship · 4 yrs",
    summary:
      "Cross-platform mobile development in Dart/Flutter, concurrent with undergraduate studies.",
    details: [
      "Shipped cross-platform apps in Flutter / Dart",
      "Built reusable widget systems + state management",
      "Integrated REST / gRPC backends and offline caching",
    ],
    stack: ["Flutter", "Dart", "gRPC", "Firebase"],
  },
];

export type Project = {
  id: string;
  no: string;
  kind: string;
  name: string;
  impact: string;
  tags: string[];
  href: string;
};

export const projects: Project[] = [
  { id: "relay", no: "01", kind: "rag", name: "Relay", impact: "Grounded support agent — cut hallucinated answers ~62% with reranked retrieval + eval gating.", tags: ["Python", "vLLM", "pgvector"], href: "#" },
  { id: "ledger", no: "02", kind: "infra", name: "Ledger", impact: "LLM cost/latency observability — per-query token accounting across 4 model providers.", tags: ["FastAPI", "OTel", "ClickHouse"], href: "#" },
  { id: "prism", no: "03", kind: "agents", name: "Prism", impact: "Tool-calling workflow engine — deterministic replays for multi-step agent runs.", tags: ["TypeScript", "LangGraph"], href: "#" },
  { id: "sift", no: "04", kind: "eval", name: "Sift", impact: "Offline eval harness — golden sets + LLM-judge with human calibration loop.", tags: ["Python", "pytest", "Ragas"], href: "#" },
  { id: "plate-vision", no: "05", kind: "vision", name: "Plate Vision", impact: "Real-time number-plate recognition — YOLOv8 pipeline, published in IJIRCCE '25.", tags: ["YOLOv8", "OpenCV"], href: "#publication" },
  { id: "harbor", no: "06", kind: "full-stack", name: "Harbor", impact: "Self-serve prompt/version console — ship prompt changes without a redeploy.", tags: ["Next.js", "tRPC", "Postgres"], href: "#" },
  { id: "quanta", no: "07", kind: "serving", name: "Quanta", impact: "Speculative-decoding gateway — ~1.9× throughput on the same GPU budget.", tags: ["Triton", "CUDA"], href: "#" },
  { id: "loom", no: "08", kind: "mobile", name: "Loom", impact: "On-device assistant — streaming responses in a Flutter client, offline fallback.", tags: ["Flutter", "Dart", "gRPC"], href: "#" },
  { id: "vector", no: "09", kind: "data", name: "Vector", impact: "Embedding ingestion pipeline — dedup + chunking that halved index size.", tags: ["Airflow", "Qdrant"], href: "#" },
];

export type SkillGroup = { cat: string; items: string[] };

export const skills: SkillGroup[] = [
  { cat: "LLMs / GenAI", items: ["RAG & retrieval", "Agents & tool-use", "Prompt & eval design", "Fine-tuning / LoRA", "vLLM · Triton"] },
  { cat: "ML", items: ["PyTorch", "YOLOv8 · OpenCV", "Embeddings", "Classical ML"] },
  { cat: "Backend", items: ["Python · FastAPI", "Node · tRPC", "Postgres · pgvector", "ClickHouse · Redis"] },
  { cat: "Frontend", items: ["Next.js · React", "TypeScript", "Flutter · Dart"] },
  { cat: "Infra / Tools", items: ["Docker · K8s", "OpenTelemetry", "AWS · GCP", "CI/CD · Git"] },
];

export const publication = {
  title: "Plate Vision: A Number Plate Recognition Using AI/ML and YOLOv8",
  authors: "C. Singh et al.",
  venue: "International Journal of Innovative Research in Computer and Communication Engineering (IJIRCCE)",
  volume: "Vol. 13, Issue 5",
  date: "May 2025",
  impactFactor: "8.771",
  issn: "2320-9801",
};

export function resumeJson() {
  return JSON.stringify(
    {
      name: "Chirag Singh",
      role: "AI Engineer — GenAI & Full-Stack",
      focus: ["llm systems in production", "retrieval", "evals", "serving"],
      experience: experiences.map((e) => ({ title: e.title, org: e.org, period: e.period })),
      publications: [
        {
          title: publication.title,
          venue: "IJIRCCE 13(5)",
          year: 2025,
          impactFactor: 8.771,
        },
      ],
      links: {
        github: "github.com/chirag405",
        leetcode: "leetcode.com/chirag405",
        linkedin: "linkedin.com/in/chirag404",
        x: "x.com/chirag405",
      },
    },
    null,
    2
  );
}
