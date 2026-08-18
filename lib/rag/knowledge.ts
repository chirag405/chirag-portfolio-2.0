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
    text: "Chirag Singh is a Software Engineer with ~1.3+ years of experience building AI-native products across GenAI, full-stack, and mobile/web/XR surfaces, based in Pune, India. He builds and operates LLM systems in production — retrieval, evals, and serving that hold up under real load — with hands-on experience in RAG, GraphRAG, LangGraph, MCP, and native Quest rendering via Meta Spatial SDK and Vulkan. He has shipped 12 projects showcased on this site (SayWhat, UpCraft, ToolX, Plate-AI, Chatalytic, PilPal, FreshKeep, Utsav Khata, AnchorTab, FieldMind, LifeAdmin, Nakama), plus grillD — an AI idea-to-blueprint platform he's actively building — and has 1 publication. He is currently available for work.",
  },
  {
    id: "experience-incerro",
    title: "Current role — Incerro",
    text: "Since July 2025 (present), Chirag is an Associate GenAI & Full-Stack Engineer at Incerro (hybrid, Pune). He architected the production RAG pipeline end to end — retrieval, reranking, evaluation gating — and extended it with GraphRAG for relationship-aware retrieval, improving answer relevance by 20% and multi-hop query accuracy by 25%. He built agentic AI workflows in LangGraph instrumented with Langfuse tracing and evals, cutting token consumption by 30% and p95 response latency by 35% while raising output quality scores. He developed MCP (Model Context Protocol) servers to standardize internal tool/data access for LLM agents, cutting new-tool onboarding time by 40%. He shipped production full-stack surfaces in Next.js, FastAPI, and React Native — including internal prompt-versioning and evaluation tooling — reducing prompt iteration cycle time by 50%. He also engineered XR rendering for Meta Quest using Meta Spatial SDK and Vulkan on native Android, sustaining 72 FPS under target frame-time budgets. Stack: Python, LangChain, LangGraph, Langfuse, GraphRAG, MCP, vLLM, FastAPI, Next.js, React Native, Postgres, Meta Spatial SDK, Vulkan.",
  },
  {
    id: "experience-flutter",
    title: "Prior role — Flutter developer internship",
    text: "From June 2024 to September 2024, Chirag was a Flutter Developer Intern at Higroove Systems (hybrid, New Delhi). He developed and maintained cross-platform mobile apps in Flutter/Dart with consistent performance and UI parity across Android and iOS, built and integrated on-device AI models using TensorFlow Lite and OpenCV for real-time image-based features (inference with zero network dependency), and optimized app performance through profiling and bug remediation — cutting cold-start load time by 32% and crash rate by 24%. Stack: Flutter, Dart, TensorFlow Lite, OpenCV, REST APIs, Android, iOS.",
  },
  {
    id: "project-saywhat",
    title: "Project: SayWhat",
    text: "SayWhat (saywhatt.online) is a realtime multiplayer social gaming platform — AI Game Master, AI Courtroom, Blank Check, and Truth or Trash — serving ~1500 users to date. Chirag engineered a multi-LLM orchestration layer with LangChain, routing prompts across providers to balance response latency against generation cost, and implemented synchronized reveal mechanics over Supabase realtime channels, keeping game state consistent across concurrent player sessions with sub-second sync. Stack: Next.js, TypeScript, Supabase, LangChain, Langfuse. Category: game.",
  },
  {
    id: "project-grilld",
    title: "Project: grillD",
    text: "grillD (grilld-frontend.vercel.app) is an AI-powered idea-to-blueprint platform: an adaptive, memory-backed interrogation engine that grills a user's raw idea until it's a complete project starting package — architecture diagrams, phased roadmaps, infra scaffolding, and agent-ready spec files. Chirag architected a multi-agent LangGraph pipeline of specialist agents, including a dedicated Rubric Agent that adversarially scores and rejects underspecified requirements before generation proceeds. He designed a three-layer memory system (canonical Postgres state, compacted working context, append-only episodic log) so users can resume multi-week interviews with zero context degradation, and deployed a three-service architecture (Next.js, Spring Boot, LangGraph Platform) across Vercel and Railway using Dockerized multi-stage builds over a shared Postgres instance on a private network. Stack: Next.js, Spring Boot, Python, LangGraph, Redis, Docker, Railway, Langfuse. Category: genai.",
  },
  {
    id: "project-upcraft",
    title: "Project: UpCraft",
    text: "UpCraft (up-craft-181t.vercel.app) is an AI-powered resume and cover-letter generator with industry-specific recommendations, plus an interview-prep system with 50+ mock quizzes and personalized feedback. Automated document generation via Inngest cut processing time ~40%. Stack: Next.js, Prisma, Clerk, Gemini, Inngest. Category: genai.",
  },
  {
    id: "project-toolx",
    title: "Project: ToolX",
    text: "ToolX (tool-x-weld.vercel.app) turns YouTube videos into AI chatbots using the video transcript as context, auto-generates scripts/titles/thumbnails, and pulls live YouTube metrics (views, likes, comments) into the chat flow. Stack: Next.js, Convex, Clerk, OpenAI. Category: genai.",
  },
  {
    id: "project-plate-ai",
    title: "Project: Plate-AI",
    text: "Plate-AI (auto-plate-capture.vercel.app) is a real-time number-plate recognition system — YOLOv8 for detection, Tesseract for OCR — working across images, video, and live camera feeds. This is the same work behind Chirag's IJIRCCE 2025 publication. Stack: YOLOv8, Tesseract, OpenCV, Next.js. Category: vision.",
  },
  {
    id: "project-chatalytic",
    title: "Project: Chatalytic",
    text: "Chatalytic (chatalytic.streamlit.app) analyzes WhatsApp and Telegram chat exports — message stats, activity patterns, word clouds — plus LLM-powered semantic Q&A over the chat history using LangChain, Gemini, and ChromaDB as the vector store. Stack: Python, Streamlit, LangChain, ChromaDB. Category: analytics.",
  },
  {
    id: "project-pilpal",
    title: "Project: PilPal",
    text: "PilPal is a medicine-reminder mobile app built with Expo/React Native: scheduled push notifications, biometric authentication, a calendar view, and offline-first local storage so users never miss a dose. Stack: React Native, Expo, biometric auth. Category: mobile.",
  },
  {
    id: "project-freshkeep",
    title: "Project: FreshKeep",
    text: "FreshKeep is an Expo/React Native app for tracking expiry dates and recurring household 'last time' tasks, with private or shared household lists, on-device printed-date scanning via ML Kit, and a premium AI voice assistant ('Mili') built on Claude and LangGraph. Not yet published to the Play Store. Stack: Expo, Supabase, LangGraph, ML Kit. Category: mobile.",
  },
  {
    id: "project-utsavkhata",
    title: "Project: Utsav Khata",
    text: "Utsav Khata (utsavkhata-web.vercel.app) is the shared money and planning ledger for Indian celebrations — a mobile + web app (Turborepo monorepo) where a family collaboratively tracks budget, expenses, and vendor payments across a multi-event wedding or other celebration, with an activity log for dispute resolution. Stack: Next.js, Expo, Firebase, Turborepo. Category: fintech.",
  },
  {
    id: "project-anchortab",
    title: "Project: AnchorTab",
    text: "AnchorTab (anchortab.vercel.app) is an AI-powered Chrome extension (Manifest V3) that scores every open browser tab in real time — On Goal, Drifting, Unrelated — against a stated focus goal, shown in a live side panel with per-tab reasoning. Includes tab blocking, nudge notifications, one-click cleanup, and session history/export. Stack: React, Vite, Cloudflare Workers, Gemini/GPT-4o-mini. Category: extension.",
  },
  {
    id: "project-fieldmind",
    title: "Project: FieldMind",
    text: "FieldMind is an agentic AI back-office for trades businesses (HVAC, plumbers, electricians, roofers) — 5 autonomous agent loops covering 24/7 AI voice lead capture and booking, scheduling/dispatch, auto-invoicing, review/reputation management, and proactive rebooking outreach. Positioned as a low-end AI-native alternative to ServiceTitan/Jobber. Stack: Next.js, Claude API, VAPI, Twilio, Supabase. Category: genai.",
  },
  {
    id: "project-lifeadmin",
    title: "Project: LifeAdmin",
    text: "LifeAdmin (lifeadmin-web.vercel.app) extracts deadlines and action items hiding in photographed documents — insurance policies, EMI schedules, rent agreements, RC books, court notices, hospital bills — built for the Indian market. Claude reads the document on upload and answers questions in English, Hindi, or Hinglish; the app then sends reminders via WhatsApp, push, or email, cross-referenced against a regulatory calendar. Strong emphasis on encryption and tamper-evident logs. Stack: Next.js, Expo, LangChain, Supabase. Category: genai.",
  },
  {
    id: "project-nakama",
    title: "Project: Nakama",
    text: "Nakama (nakama-web-amber.vercel.app, working title) is an anime and manga social platform — a TikTok-style feed, Reddit-style Guilds and theory 'Scrolls,' swipe-based matching, a creator art vault with tipping, an affiliate merch marketplace, and an AI chat companion ('Senpai'), all unified by a per-user taste-and-knowledge graph. India-first, designed to expand globally. Stack: Next.js, Expo, tRPC, Supabase. Category: social.",
  },
  {
    id: "publication",
    title: "Publication",
    text: "Chirag co-authored 'Plate Vision: A Number Plate Recognition Using AI/ML and YOLOv8', published in the International Journal of Innovative Research in Computer and Communication Engineering (IJIRCCE), Volume 13, Issue 5, May 2025. Impact Factor 8.771. This is the research behind the Plate-AI project.",
  },
  {
    id: "education",
    title: "Education",
    text: "Chirag has a B.Tech in Computer Science from Raj Kumar Goel Institute of Technology, Ghaziabad, Uttar Pradesh (Aug 2021 – Jul 2025), with a CGPA of 7.7.",
  },
  {
    id: "stack",
    title: "Full skills / stack",
    text: "Languages: TypeScript, JavaScript, Python, Java, Dart, SQL, Kotlin, C/C++. Generative AI / LLM: LangChain, LangGraph, LlamaIndex, MCP (Model Context Protocol), fine-tuning, RAG, GraphRAG, AI agents, agentic workflows, orchestration, prompt engineering, context engineering, memory management, LLM-as-a-judge, embeddings, vector search, evals, vLLM, n8n, Langfuse. Machine Learning / Computer Vision: TensorFlow, TensorFlow Lite, Scikit-learn, YOLOv8, OpenCV, Tesseract, Hugging Face, computer vision, object detection, image classification, OCR, image processing, classical ML, model training, model evaluation, inference. Backend: Node.js, Express.js, FastAPI, Spring Boot, tRPC, PostgreSQL, MySQL, Redis, VectorDB, GraphDB, NoSQL. Frontend: React, Next.js, Tailwind CSS, Zustand, Redux. Mobile: Flutter, React Native (Expo). XR / 3D / Spatial Computing: Meta Spatial SDK, Vulkan, Three.js, React Three Fiber, WebXR, OpenXR, Android XR, AndroidX XR, SceneCore, Niantic Spatial SDK, Babylon.js, A-Frame, WebGL. Cloud & Infrastructure: Docker, Kubernetes, AWS, GCP, Cloudflare Workers, Vercel, Railway, Netlify, AWS Amplify, ArgoCD, CI/CD, Langfuse, Phoenix. Developer Tools: Git, GitHub, Bitbucket, Clerk, Inngest, Bubblewrap, Chrome DevTools, Android NDK, CMake, Spector.js, WebGL Inspector. Testing: Vitest, Playwright.",
  },
  {
    id: "contact",
    title: "Contact and links",
    text: "To actually reach Chirag, use email (chiragdhouni20@gmail.com), LinkedIn (linkedin.com/in/chirag404), or X/DM (x.com/chirag405) — he's open to interesting LLM-in-production problems. GitHub (github.com/chirag405) and LeetCode (leetcode.com/chirag406) are for browsing his code and solved problems, not contact channels — nobody's checking LeetCode DMs.",
  },
];

export function formatKnowledgeForPrompt(docs: KnowledgeDoc[]): string {
  return docs
    .map((doc) => `### ${doc.title}\n${doc.text}`)
    .join("\n\n");
}
