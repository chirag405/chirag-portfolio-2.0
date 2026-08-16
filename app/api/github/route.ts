import { getGithubStats } from "@/lib/github";

export const runtime = "nodejs";

export async function GET() {
  try {
    const stats = await getGithubStats();
    return Response.json(stats, {
      headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=240" },
    });
  } catch (err) {
    console.error("[github] fetch failed:", err);
    return Response.json({ error: "github_unavailable" }, { status: 502 });
  }
}
