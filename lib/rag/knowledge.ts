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
    text: "Chirag Singh is an AI Engineer focused on GenAI and full-stack engineering, based in India (IN). He builds and operates LLM systems in production — retrieval, evals, and serving that hold up under real load. He has 1.8 years of experience engineering AI, has shipped 12 projects (SayWhat, UpCraft, ToolX, Plate-AI, Chatalytic, PilPal, FreshKeep, Utsav Khata, AnchorTab, FieldMind, LifeAdmin, Nakama), and has 1 publication. He is currently available for work.",
  },
  {
    id: "experience-incerro",
    title: "Current role — Incerro",
    text: "Since 2024 (present), Chirag is an Associate GenAI & Full-Stack Engineer at Incerro. He builds and ships GenAI features end-to-end — retrieval, model serving, and the full-stack surfaces around them. He owns the RAG pipeline (retrieval → reranking → eval gating before responses ship), does model serving on vLLM / Triton under explicit latency budgets, and builds full-stack surfaces in Next.js + FastAPI with prompt/version tooling. Stack: Python, vLLM, FastAPI, Next.js, Postgres.",
  },
  {
    id: "experience-flutter",
    title: "Prior role — Flutter developer internship",
    text: "From June 2024 to September 2024, Chirag was a Flutter Developer Intern at Higroove Systems, doing cross-platform mobile development in Dart/Flutter. He developed and maintained cross-platform apps with consistent performance across Android and iOS, built responsive/adaptive UI components, integrated REST APIs and third-party services for real-time data, and optimized app performance (faster load times, fewer crashes). Stack: Flutter, Dart, REST APIs.",
  },
  {
    id: "project-saywhat",
    title: "Project: SayWhat",
    text: "SayWhat (saywhat.quest) is a realtime browser party-game suite where players join short-lived rooms and play AI-hosted games — AI Game Master, AI Courtroom, Blank Check, and Truth or Trash — with synchronized reveals and AI-generated scoring/roasts. Uses LangChain to pick between multiple LLM providers (Anthropic, Google, Groq). Has automatic host handoff and player reconnection support — around 300 daily users. Stack: Next.js, Supabase, LangChain, multi-LLM. Category: game.",
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
    text: "Utsav Khata is the shared money and planning ledger for Indian celebrations — a mobile + web app (Turborepo monorepo) where a family collaboratively tracks budget, expenses, and vendor payments across a multi-event wedding or other celebration, with an activity log for dispute resolution. Not yet publicly deployed. Stack: Next.js, Expo, Firebase, Turborepo. Category: fintech.",
  },
  {
    id: "project-anchortab",
    title: "Project: AnchorTab",
    text: "AnchorTab is an AI-powered Chrome extension (Manifest V3) that scores every open browser tab in real time — On Goal, Drifting, Unrelated — against a stated focus goal, shown in a live side panel with per-tab reasoning. Includes tab blocking, nudge notifications, one-click cleanup, and session history/export. Not yet published to the Chrome Web Store. Stack: React, Vite, Cloudflare Workers, Gemini/GPT-4o-mini. Category: extension.",
  },
  {
    id: "project-fieldmind",
    title: "Project: FieldMind",
    text: "FieldMind is an agentic AI back-office for trades businesses (HVAC, plumbers, electricians, roofers) — 5 autonomous agent loops covering 24/7 AI voice lead capture and booking, scheduling/dispatch, auto-invoicing, review/reputation management, and proactive rebooking outreach. Positioned as a low-end AI-native alternative to ServiceTitan/Jobber. Not yet fully live. Stack: Next.js, Claude API, VAPI, Twilio, Supabase. Category: genai.",
  },
  {
    id: "project-lifeadmin",
    title: "Project: LifeAdmin",
    text: "LifeAdmin extracts deadlines and action items hiding in photographed documents — insurance policies, EMI schedules, rent agreements, RC books, court notices, hospital bills — built for the Indian market. Claude reads the document on upload and answers questions in English, Hindi, or Hinglish; the app then sends reminders via WhatsApp, push, or email, cross-referenced against a regulatory calendar. Strong emphasis on encryption and tamper-evident logs. Stack: Next.js, Expo, LangChain, Supabase. Category: genai.",
  },
  {
    id: "project-nakama",
    title: "Project: Nakama",
    text: "Nakama (working title) is an anime and manga social platform — a TikTok-style feed, Reddit-style Guilds and theory 'Scrolls,' swipe-based matching, a creator art vault with tipping, an affiliate merch marketplace, and an AI chat companion ('Senpai'), all unified by a per-user taste-and-knowledge graph. India-first, designed to expand globally. Stack: Next.js, Expo, tRPC, Supabase. Category: social.",
  },
  {
    id: "publication",
    title: "Publication",
    text: "Chirag co-authored 'Plate Vision: A Number Plate Recognition Using AI/ML and YOLOv8', published in the International Journal of Innovative Research in Computer and Communication Engineering (IJIRCCE), Volume 13, Issue 5, May 2025. Impact Factor 8.771, ISSN 2320-9801. This is the research behind the Plate-AI project.",
  },
  {
    id: "stack",
    title: "Full skills / stack",
    text: "Languages: TypeScript, JavaScript, Python, Java, Dart, SQL, Kotlin, C/C++. Generative AI / LLM: LangChain, LangGraph, LlamaIndex, fine-tuning, RAG, AI agents, agentic workflows, orchestration, prompt engineering, context engineering, memory management, LLM-as-a-judge, embeddings, vector search, evals, vLLM. Machine Learning / Computer Vision: TensorFlow, Scikit-learn, YOLOv8, OpenCV, Tesseract, Hugging Face, computer vision, object detection, image classification, OCR, image processing, classical ML, model training, model evaluation, inference. Backend: Node.js, Express.js, FastAPI, Spring Boot, tRPC, PostgreSQL, MySQL, Redis. Frontend: React, Next.js, Tailwind CSS, Zustand, Redux. Mobile: Flutter, React Native, Expo. XR / 3D / Spatial Computing: Three.js, React Three Fiber, WebXR, OpenXR, Android XR, AndroidX XR, SceneCore, Meta Spatial SDK, Niantic Spatial SDK, Babylon.js, A-Frame, WebGL. Cloud & Infrastructure: Docker, Kubernetes, AWS, GCP, Cloudflare Workers, Vercel, Netlify, AWS Amplify, CI/CD, Langfuse, Phoenix. Developer Tools: Git, GitHub, Clerk, Inngest, Bubblewrap, Chrome DevTools, Android NDK, CMake, Spector.js, WebGL Inspector. Testing: Vitest, Playwright.",
  },
  {
    id: "contact",
    title: "Contact and links",
    text: "Chirag can be reached via GitHub (github.com/chirag405), LeetCode (leetcode.com/chirag406), LinkedIn (linkedin.com/in/chirag404), X (x.com/chirag405), or email (hello@chirag.dev). He is open to interesting LLM-in-production problems.",
  },
];

export function formatKnowledgeForPrompt(docs: KnowledgeDoc[]): string {
  return docs
    .map((doc) => `### ${doc.title}\n${doc.text}`)
    .join("\n\n");
}
