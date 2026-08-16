import { getLeetcodeStats } from "@/lib/leetcode";

export const runtime = "nodejs";

export async function GET() {
  try {
    const stats = await getLeetcodeStats();
    return Response.json(stats, {
      headers: { "Cache-Control": "public, max-age=120, stale-while-revalidate=480" },
    });
  } catch (err) {
    console.error("[leetcode] fetch failed:", err);
    return Response.json({ error: "leetcode_unavailable" }, { status: 502 });
  }
}
