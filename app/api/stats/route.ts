import { getUsageSummary } from "@/lib/usage-store";

export const runtime = "nodejs";

export async function GET() {
  const summary = await getUsageSummary();
  return Response.json(summary, {
    headers: { "Cache-Control": "no-store" },
  });
}
