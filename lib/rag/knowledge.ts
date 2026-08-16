export type KnowledgeDoc = {
  id: string;
  title: string;
  text: string;
};

// Source of truth for the chatbot's grounded answers — mirrors the portfolio's
// own content (experience, projects, skills, publication) so the assistant
// never has to guess at facts about Chirag.
export const knowledgeBase: KnowledgeDoc[] = [
  {
    id: "bio",
    title: "Who Chirag is",
    text: "Chirag Singh is an AI Engineer focused on GenAI and full-stack engineering, based in India (IN). He builds and operates LLM systems in production — retrieval, evals, and serving that hold up under real load. He has 1.8 years of experience engineering AI, has shipped 9 projects, and has 1 publication. He is currently available for work.",
  },
  {
    id: "experience-incerro",
    title: "Current role — Incerro",
    text: "Since 2024 (present), Chirag is an Associate GenAI & Full-Stack Engineer at Incerro. He builds and ships GenAI features end-to-end — retrieval, model serving, and the full-stack surfaces around them. He owns the RAG pipeline (retrieval → reranking → eval gating before responses ship), does model serving on vLLM / Triton under explicit latency budgets, and builds full-stack surfaces in Next.js + FastAPI with prompt/version tooling. Stack: Python, vLLM, FastAPI, Next.js, Postgres.",
  },
  {
    id: "experience-flutter",
    title: "Prior role — Flutter developer internship",
    text: "From 2020 to 2024 (4 years, concurrent with undergraduate studies), Chirag worked as a Flutter Developer intern, doing cross-platform mobile development in Dart/Flutter. He shipped cross-platform apps, built reusable widget systems and state management, and integrated REST/gRPC backends with offline caching. Stack: Flutter, Dart, gRPC, Firebase.",
  },
  {
    id: "project-relay",
    title: "Project: Relay",
    text: "Relay is a grounded RAG support agent — it cut hallucinated answers by roughly 62% using reranked retrieval plus eval gating. Stack: Python, vLLM, pgvector. Category: rag.",
  },
  {
    id: "project-ledger",
    title: "Project: Ledger",
    text: "Ledger is LLM cost/latency observability infrastructure — per-query token accounting across 4 model providers. Stack: FastAPI, OpenTelemetry, ClickHouse. Category: infra.",
  },
  {
    id: "project-prism",
    title: "Project: Prism",
    text: "Prism is a tool-calling workflow engine for agents — deterministic replays for multi-step agent runs. Stack: TypeScript, LangGraph. Category: agents.",
  },
  {
    id: "project-sift",
    title: "Project: Sift",
    text: "Sift is an offline eval harness — golden sets plus an LLM-judge with a human calibration loop. Stack: Python, pytest, Ragas. Category: eval.",
  },
  {
    id: "project-plate-vision",
    title: "Project: Plate Vision",
    text: "Plate Vision is a real-time number-plate recognition system — a YOLOv8 pipeline, published in IJIRCCE 2025. Stack: YOLOv8, OpenCV. Category: vision. This is the same work as Chirag's publication.",
  },
  {
    id: "project-harbor",
    title: "Project: Harbor",
    text: "Harbor is a self-serve prompt/version console — ship prompt changes without a redeploy. Stack: Next.js, tRPC, Postgres. Category: full-stack.",
  },
  {
    id: "project-quanta",
    title: "Project: Quanta",
    text: "Quanta is a speculative-decoding gateway — about 1.9x throughput on the same GPU budget. Stack: Triton, CUDA. Category: serving.",
  },
  {
    id: "project-loom",
    title: "Project: Loom",
    text: "Loom is an on-device assistant — streaming responses in a Flutter client with offline fallback. Stack: Flutter, Dart, gRPC. Category: mobile.",
  },
  {
    id: "project-vector",
    title: "Project: Vector",
    text: "Vector is an embedding ingestion pipeline — dedup and chunking that halved index size. Stack: Airflow, Qdrant. Category: data.",
  },
  {
    id: "publication",
    title: "Publication",
    text: "Chirag co-authored 'Plate Vision: A Number Plate Recognition Using AI/ML and YOLOv8', published in the International Journal of Innovative Research in Computer and Communication Engineering (IJIRCCE), Volume 13, Issue 5, May 2025. Impact Factor 8.771, ISSN 2320-9801.",
  },
  {
    id: "stack",
    title: "Full skills / stack",
    text: "LLMs / GenAI: RAG & retrieval, agents & tool-use, prompt & eval design, fine-tuning / LoRA, vLLM, Triton. ML: PyTorch, YOLOv8, OpenCV, embeddings, classical ML. Backend: Python, FastAPI, Node, tRPC, Postgres, pgvector, ClickHouse, Redis. Frontend: Next.js, React, TypeScript, Flutter, Dart. Infra / Tools: Docker, Kubernetes, OpenTelemetry, AWS, GCP, CI/CD, Git.",
  },
  {
    id: "contact",
    title: "Contact and links",
    text: "Chirag can be reached via GitHub (github.com/chirag405), LeetCode (leetcode.com/chirag405), LinkedIn (linkedin.com/in/chirag404), X (x.com/chirag405), or email (hello@chirag.dev). He is open to interesting LLM-in-production problems.",
  },
];

export function formatKnowledgeForPrompt(docs: KnowledgeDoc[]): string {
  return docs
    .map((doc) => `### ${doc.title}\n${doc.text}`)
    .join("\n\n");
}
