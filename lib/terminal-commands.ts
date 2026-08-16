import { downloadResume } from "@/lib/download-resume";

const HELP_LINES = [
  "available commands:",
  "  whoami            who I am",
  "  about             quick summary",
  "  projects          what I've shipped",
  "  stack             tech I use",
  "  github            open my GitHub",
  "  leetcode          open my LeetCode",
  "  linkedin          open my LinkedIn",
  "  resume            download resume.json",
  "  clear             clear the screen",
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
    if (cmd === "whoami") return ["chirag — ai engineer"];
    if (cmd === "about") {
      return ["AI Engineer — GenAI & Full-Stack. LLM systems in production: retrieval, evals, serving."];
    }
    if (cmd === "ls" || cmd === "ls -la") {
      return ["experience/  work/  publications/  stack/  resume.json  role.json"];
    }
    if (cmd === "github") {
      openLink("https://github.com/chirag405");
      return ["→ github.com/chirag405 (opened in a new tab)"];
    }
    if (cmd === "leetcode") {
      openLink("https://leetcode.com/chirag405");
      return ["→ leetcode.com/chirag405 (opened in a new tab)"];
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
      downloadResume();
      return ["→ downloading chirag-singh.resume.json"];
    }
    if (cmd === "projects" || cmd === "work") {
      return ["9 shipped projects — scroll to // selected work, or ask me about a specific one."];
    }
    if (cmd === "stack") {
      return ["Python, vLLM, FastAPI, Next.js, Postgres, PyTorch, Docker, K8s — full list in // stack below."];
    }

    // Fallback: real answer from the RAG-backed assistant.
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: raw, history: [], locale }),
      });
      if (!res.body) return ["(no response)"];
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
      }
      return [text || "(empty response)"];
    } catch {
      return ["command not found — try 'help', or check your connection."];
    }
  };
}
