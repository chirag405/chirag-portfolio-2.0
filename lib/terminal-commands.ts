import { openResume } from "@/lib/download-resume";

const HELP_LINES = [
  "available commands:",
  "  whoami            who I am",
  "  about             quick summary",
  "  projects          what I've shipped",
  "  stack             tech I use",
  "  github            open my GitHub",
  "  leetcode          open my LeetCode",
  "  linkedin          open my LinkedIn",
  "  resume            open resume",
  "  clear             clear the screen",
  "  sudo <anything>   nice try",
  "  <anything else>   ask me anything — answered live",
];

function openLink(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

/** Real commands for the hero terminal: a handful of fast local ones, everything else goes to the RAG chat backend. */
export function createTerminalCommandHandler(locale: string) {
  return async function handleCommand(raw: string): Promise<string[]> {
    const cmd = raw.trim().toLowerCase();

    if (cmd === "help" || cmd === "?") return HELP_LINES;
    if (cmd === "whoami") return ["chirag — ai engineer (professionally: ships LLMs to prod. personally: ships bugs to prod, then fixes them before standup)"];
    if (cmd === "about") {
      return [
        "GenAI & Full-Stack Engineer at Incerro. RAG, GraphRAG, agentic workflows, MCP servers, and occasionally rendering XR at 72 FPS so nobody gets motion-sick in the metaverse.",
      ];
    }
    if (cmd === "ls" || cmd === "ls -la") {
      return ["experience/  work/  publications/  stack/  resume.json  role.json  coffee.exe"];
    }
    if (cmd === "cat coffee.exe" || cmd === "coffee" || cmd === "./coffee.exe") {
      return ["→ Segmentation fault (core dumped). Try again after 9am."];
    }
    if (cmd.startsWith("sudo")) {
      return ["Nice try. Permission denied — this terminal runs as user 'guest', not 'chirag'."];
    }
    if (cmd === "github") {
      openLink("https://github.com/chirag405");
      return ["→ github.com/chirag405 (opened in a new tab) — mostly green squares and 2am commit messages"];
    }
    if (cmd === "leetcode") {
      openLink("https://leetcode.com/chirag406");
      return ["→ leetcode.com/chirag406 (opened in a new tab) — for browsing only, LeetCode doesn't have DMs, don't @ me there"];
    }
    if (cmd === "linkedin") {
      openLink("https://www.linkedin.com/in/chirag404/");
      return ["→ linkedin.com/in/chirag404 (opened in a new tab)"];
    }
    if (cmd === "x" || cmd === "twitter") {
      openLink("https://x.com/chirag405");
      return ["→ x.com/chirag405 (opened in a new tab)"];
    }
    if (cmd === "resume" || cmd === "cat resume.json" || cmd === "download resume") {
      openResume();
      return ["→ opening the actual resume, not the fake resume.json — that one's just a party trick"];
    }
    if (cmd === "projects" || cmd === "work") {
      return [
        "12 shipped projects on this site — SayWhat, LifeAdmin, FieldMind, Nakama, and 8 more — plus grillD, currently in the oven. Scroll to // selected work, or ask me about a specific one.",
      ];
    }
    if (cmd === "stack") {
      return [
        "Next.js, TypeScript, Python, LangChain/LangGraph, MCP, Claude/Gemini/OpenAI, Supabase, FastAPI, React Native/Flutter, and enough XR libraries to make a browser tab cry. Full list in // stack below.",
      ];
    }

    // Fallback: real answer from the RAG-backed assistant.
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: raw, history: [], locale }),
      });
      if (!res.body) return ["(no response — the assistant is having a moment)"];
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
      }
      return [text || "(empty response — even the AI didn't know what to say)"];
    } catch {
      return ["command not found — try 'help', or check your connection. (it's probably your connection)"];
    }
  };
}
