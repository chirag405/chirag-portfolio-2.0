export type Experience = {
  id: string;
  period: string;
  title: string;
  org: string;
  summary: string;
  details: string[];
  stack: string[];
  /** Company logo path, rendered next to the title/org. */
  logo?: string;
};

export const experiences: Experience[] = [
  {
    id: "incerro",
    period: "July 2025 — Present",
    title: "Associate GenAI & Full-Stack Engineer",
    org: "@ Incerro",
    summary:
      "Architected the production RAG pipeline end to end — retrieval, reranking, and evaluation gating — extending it with GraphRAG and shipping agentic workflows, full-stack surfaces, and Meta Quest XR rendering along the way.",
    details: [
      "Architected the production RAG pipeline end to end — retrieval, reranking, evaluation gating — and extended it with GraphRAG for relationship-aware retrieval, improving answer relevance by 20% and multi-hop query accuracy by 25%",
      "Built agentic AI workflows in LangGraph instrumented with Langfuse tracing and evals, cutting token consumption by 30% and p95 response latency by 35% while raising output quality scores",
      "Developed MCP (Model Context Protocol) servers to standardize internal tool and data access for LLM agents, cutting new tool onboarding time by 40%",
      "Shipped production full-stack surfaces in Next.js, FastAPI, and React Native — including internal prompt-versioning and evaluation tooling — reducing prompt iteration cycle time by 50%",
      "Engineered XR rendering for Meta Quest using Meta Spatial SDK and Vulkan on native Android, sustaining 72 FPS under target frame-time budgets",
    ],
    stack: [
      "Python",
      "LangChain",
      "LangGraph",
      "Langfuse",
      "GraphRAG",
      "MCP",
      "vLLM",
      "FastAPI",
      "Next.js",
      "React Native",
      "Postgres",
      "Meta Spatial SDK",
      "Vulkan",
    ],
    logo: "/images/logos/incerro.svg",
  },
  {
    id: "flutter",
    period: "June 2024 — Sept 2024",
    title: "Flutter Developer Intern",
    org: "@ Higroove Systems",
    summary:
      "Hybrid internship — cross-platform mobile development in Flutter/Dart, shipping on-device AI features with TensorFlow Lite and OpenCV across Android and iOS.",
    details: [
      "Developed and maintained cross-platform mobile applications in Flutter/Dart, delivering consistent performance and UI parity across Android and iOS",
      "Built and integrated on-device AI models using TensorFlow Lite and OpenCV for real-time image-based features, enabling inference without network dependency",
      "Optimized application performance through profiling and bug remediation, reducing cold-start load time by 32% and crash rate by 24%",
    ],
    stack: ["Flutter", "Dart", "TensorFlow Lite", "OpenCV", "REST APIs", "Android", "iOS"],
    logo: "/images/logos/higroove.png",
  },
];

export type Project = {
  id: string;
  no: string;
  kind: string;
  name: string;
  impact: string;
  tags: string[];
  /** Live URL, or "#" when there's no public deployment yet. */
  href: string;
  /** Public repo URL — omitted for projects whose source is still private. */
  github?: string;
  /** Real screenshot path — omitted for projects with no live site to capture. */
  image?: string;
};

// Verified against github.com/chirag405 (repo READMEs + package.json) for
// the first 6, and against local project folders (private repos, not on
// GitHub) for the rest. `href: "#"` marks projects with no public
// deployment yet — the work-section UI hides the "open project" CTA for
// those instead of linking to a private repo or a placeholder.
export const projects: Project[] = [
  {
    id: "saywhat",
    no: "01",
    kind: "game",
    name: "SayWhat",
    impact:
      "Realtime AI party-game suite — AI Game Master, AI Courtroom, Blank Check, Truth or Trash — synchronized reveals, ~300 daily users.",
    tags: ["Next.js", "Supabase", "LangChain", "Multi-LLM"],
    href: "https://saywhatt.online/",
    github: "https://github.com/chirag405/SayWhat",
    image: "/images/projects/saywhat.jpg",
  },
  {
    id: "upcraft",
    no: "02",
    kind: "genai",
    name: "UpCraft",
    impact:
      "AI resume & cover-letter builder with 50+ mock interview quizzes — automated doc pipeline via Inngest, ~40% faster.",
    tags: ["Next.js", "Prisma", "Clerk", "Gemini"],
    href: "https://up-craft-181t.vercel.app/",
    github: "https://github.com/chirag405/UpCraft",
    image: "/images/projects/upcraft.png",
  },
  {
    id: "toolx",
    no: "03",
    kind: "genai",
    name: "ToolX",
    impact:
      "Turns any YouTube video into an AI chatbot from its transcript — auto-generates scripts, titles, and thumbnails.",
    tags: ["Next.js", "Convex", "Clerk", "OpenAI"],
    href: "https://tool-x-weld.vercel.app/",
    github: "https://github.com/chirag405/toolX",
    image: "/images/projects/toolx.png",
  },
  {
    id: "plate-ai",
    no: "04",
    kind: "vision",
    name: "Plate-AI",
    impact:
      "Real-time number-plate recognition — YOLOv8 detection + Tesseract OCR across images, video, and live camera. Published in IJIRCCE '25.",
    tags: ["YOLOv8", "Tesseract", "OpenCV", "Next.js"],
    href: "https://auto-plate-capture.vercel.app/",
    github: "https://github.com/chirag405/auto-plate-capture",
    image: "/images/projects/plate-ai.png",
  },
  {
    id: "chatalytic",
    no: "05",
    kind: "analytics",
    name: "Chatalytic",
    impact:
      "WhatsApp/Telegram chat analytics with LLM-powered insights — LangChain + Gemini + ChromaDB alongside stats and word clouds.",
    tags: ["Python", "Streamlit", "LangChain", "ChromaDB"],
    href: "https://chatalytic.streamlit.app/",
    github: "https://github.com/chirag405/Chatalytic",
    image: "/images/projects/chatalytic.png",
  },
  {
    id: "pilpal",
    no: "06",
    kind: "mobile",
    name: "PilPal",
    impact:
      "Medicine reminder app — biometric auth, scheduled notifications, calendar view, offline-first local storage.",
    tags: ["React Native", "Expo", "Biometric Auth"],
    href: "https://github.com/chirag405/PilPal-medicine-reminder",
    github: "https://github.com/chirag405/PilPal-medicine-reminder",
    image: "/images/projects/pilpal.png",
  },
  {
    id: "freshkeep",
    no: "07",
    kind: "mobile",
    name: "FreshKeep",
    impact:
      "Tracks expiry dates and recurring household tasks — on-device printed-date scanning via ML Kit, plus an AI voice assistant on Claude + LangGraph.",
    tags: ["Expo", "Supabase", "LangGraph", "ML Kit"],
    href: "#",
  },
  {
    id: "utsavkhata",
    no: "08",
    kind: "fintech",
    name: "Utsav Khata",
    impact:
      "Shared budget & vendor-payment ledger for Indian celebrations — family-collaborative expense tracking across multi-event weddings, with a full activity log.",
    tags: ["Next.js", "Expo", "Firebase", "Turborepo"],
    href: "https://utsavkhata-web.vercel.app/",
    image: "/images/projects/utsavkhata.jpg",
  },
  {
    id: "anchortab",
    no: "09",
    kind: "extension",
    name: "AnchorTab",
    impact:
      "AI-powered Chrome extension that scores every open tab — on goal, drifting, unrelated — against a stated focus goal, with nudges and one-click cleanup.",
    tags: ["Chrome Extension", "React", "Cloudflare Workers", "Gemini"],
    href: "https://anchortab.vercel.app/",
    image: "/images/projects/anchortab.jpg",
  },
  {
    id: "fieldmind",
    no: "10",
    kind: "genai",
    name: "FieldMind",
    impact:
      "Agentic AI back-office for trades businesses — 5 autonomous loops covering voice-answered lead capture, scheduling, invoicing, and reputation.",
    tags: ["Next.js", "Claude API", "VAPI", "Twilio"],
    href: "https://web-5k2a6cvz6-chiragdhounis-projects.vercel.app/",
    image: "/images/projects/fieldmind.jpg",
  },
  {
    id: "lifeadmin",
    no: "11",
    kind: "genai",
    name: "LifeAdmin",
    impact:
      "Extracts deadlines and action items from photographed documents — insurance, EMIs, rent — via Claude, then reminds you over WhatsApp in English, Hindi, or Hinglish.",
    tags: ["Next.js", "Expo", "LangChain", "Supabase"],
    href: "https://lifeadmin-web.vercel.app/",
    image: "/images/projects/lifeadmin.jpg",
  },
  {
    id: "nakama",
    no: "12",
    kind: "social",
    name: "Nakama",
    impact:
      "Anime & manga social platform — TikTok-style feed, theory Guilds, swipe matching, a creator art vault, and an AI companion, unified by a per-user taste graph.",
    tags: ["Next.js", "Expo", "tRPC", "Supabase"],
    href: "https://nakama-web-amber.vercel.app/",
    image: "/images/projects/nakama.jpg",
  },
];

export type SkillGroup = { cat: string; items: string[] };

export const skills: SkillGroup[] = [
  {
    cat: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "Java", "Dart", "SQL", "Kotlin", "C/C++"],
  },
  {
    cat: "Generative AI / LLM",
    items: [
      "LangChain",
      "LangGraph",
      "LlamaIndex",
      "Fine-tuning",
      "RAG",
      "AI Agents",
      "Agentic Workflows",
      "Orchestration",
      "Prompt Engineering",
      "Context Engineering",
      "Memory Management",
      "LLM-as-a-Judge",
      "Embeddings",
      "Vector Search",
      "Evals",
      "vLLM",
    ],
  },
  {
    cat: "Machine Learning / Computer Vision",
    items: [
      "TensorFlow",
      "Scikit-learn",
      "YOLOv8",
      "OpenCV",
      "Tesseract",
      "Hugging Face",
      "Computer Vision",
      "Object Detection",
      "Image Classification",
      "OCR",
      "Image Processing",
      "Classical ML",
      "Model Training",
      "Model Evaluation",
      "Inference",
    ],
  },
  {
    cat: "Backend",
    items: ["Node.js", "Express.js", "FastAPI", "Spring Boot", "tRPC", "PostgreSQL", "MySQL", "Redis"],
  },
  {
    cat: "Frontend",
    items: ["React", "Next.js", "Tailwind CSS", "Zustand", "Redux"],
  },
  {
    cat: "Mobile",
    items: ["Flutter", "React Native", "Expo"],
  },
  {
    cat: "XR / 3D / Spatial Computing",
    items: [
      "Three.js",
      "React Three Fiber",
      "WebXR",
      "OpenXR",
      "Android XR",
      "AndroidX XR",
      "SceneCore",
      "Meta Spatial SDK",
      "Niantic Spatial SDK",
      "Babylon.js",
      "A-Frame",
      "WebGL",
    ],
  },
  {
    cat: "Cloud & Infrastructure",
    items: [
      "Docker",
      "Kubernetes",
      "AWS",
      "GCP",
      "Cloudflare Workers",
      "Vercel",
      "Netlify",
      "AWS Amplify",
      "CI/CD",
      "Langfuse",
      "Phoenix",
    ],
  },
  {
    cat: "Developer Tools",
    items: [
      "Git",
      "GitHub",
      "Clerk",
      "Inngest",
      "Bubblewrap",
      "Chrome DevTools",
      "Android NDK",
      "CMake",
      "Spector.js",
      "WebGL Inspector",
    ],
  },
  {
    cat: "Testing",
    items: ["Vitest", "Playwright"],
  },
];

export const publication = {
  title: "Plate Vision: A Number Plate Recognition Using AI/ML and YOLOv8",
  authors: "C. Singh et al.",
  venue:
    "International Journal of Innovative Research in Computer and Communication Engineering (IJIRCCE)",
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
      experience: experiences.map((e) => ({
        title: e.title,
        org: e.org,
        period: e.period,
      })),
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
        leetcode: "leetcode.com/chirag406",
        linkedin: "linkedin.com/in/chirag404",
        x: "x.com/chiragdhouni",
      },
    },
    null,
    2,
  );
}
