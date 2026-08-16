import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { retrieve } from "@/lib/rag/retrieve";
import { formatKnowledgeForPrompt } from "@/lib/rag/knowledge";
import { computeCostUsd, recordUsage } from "@/lib/usage-store";
import { isRateLimited } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MODEL = "claude-sonnet-5";
const MAX_MESSAGE_LENGTH = 600;
const MAX_HISTORY_TURNS = 6;

type ChatTurn = { role: "user" | "assistant"; content: string };

function buildSystemPrompt(locale: string, context: string) {
  return `You are "ask_chirag", the AI assistant embedded in Chirag Singh's portfolio website (an AI engineer working on GenAI and full-stack systems).

Answer questions about Chirag's experience, projects, publication, and skills using ONLY the context below — do not invent facts not present in it. If a question is unrelated to Chirag's work, briefly say what you can help with instead (experience, the 9 projects, the stack, the IJIRCCE publication, or GitHub/LeetCode activity).

Keep answers short and conversational — 1 to 3 sentences, no markdown headers, no bullet lists unless truly needed. Respond in the same language as the visitor's message; if unclear, default to this locale: ${locale}.

<context>
${context}
</context>`;
}

function clientKeyFor(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  const key = clientKeyFor(req);
  if (isRateLimited(key)) {
    return new Response("You're sending messages a bit fast — try again in a few minutes.", {
      status: 429,
    });
  }

  let body: { message?: string; history?: ChatTurn[]; locale?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid request body.", { status: 400 });
  }

  const message = (body.message ?? "").trim().slice(0, MAX_MESSAGE_LENGTH);
  if (!message) {
    return new Response("Message is required.", { status: 400 });
  }
  const locale = body.locale ?? "en";
  const history = (body.history ?? []).slice(-MAX_HISTORY_TURNS);

  const contextDocs = retrieve(message, 4);
  const system = buildSystemPrompt(locale, formatKnowledgeForPrompt(contextDocs));

  if (!process.env.ANTHROPIC_API_KEY) {
    const fallback =
      "The live assistant isn't configured yet (missing ANTHROPIC_API_KEY on the server) — but you can find everything about my work in the sections above: experience, projects, stack, and the IJIRCCE publication.";
    return new Response(fallback, { status: 200 });
  }

  const client = new Anthropic();
  const startedAt = Date.now();

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const anthropicStream = client.messages.stream({
          model: MODEL,
          max_tokens: 500,
          thinking: { type: "disabled" },
          system,
          messages: [
            ...history.map((h) => ({ role: h.role, content: h.content })),
            { role: "user" as const, content: message },
          ],
        });

        anthropicStream.on("text", (delta) => {
          controller.enqueue(encoder.encode(delta));
        });

        const final = await anthropicStream.finalMessage();
        const latencyMs = Date.now() - startedAt;
        const inputTokens = final.usage.input_tokens;
        const outputTokens = final.usage.output_tokens;
        await recordUsage({
          ts: Date.now(),
          inputTokens,
          outputTokens,
          cacheReadTokens: final.usage.cache_read_input_tokens ?? 0,
          latencyMs,
          costUsd: computeCostUsd(inputTokens, outputTokens),
        });

        controller.close();
      } catch (err) {
        console.error("[chat] Anthropic request failed:", err);
        controller.enqueue(
          encoder.encode(
            "Something went wrong reaching the model — please try again in a moment."
          )
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
