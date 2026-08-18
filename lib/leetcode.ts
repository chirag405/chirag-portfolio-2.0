import { relativeTime } from "@/lib/relative-time";

const LEETCODE_USERNAME = "chirag406";
const CACHE_TTL_MS = 10 * 60 * 1000;

export type LeetcodeStats = {
  easy: number;
  medium: number;
  hard: number;
  streak: number;
  ranking: number | null;
  recentSolves: { title: string; when: string }[];
};

const QUERY = `query getUserProfile($username: String!) {
  matchedUser(username: $username) {
    username
    profile { ranking }
    submitStats: submitStatsGlobal {
      acSubmissionNum { difficulty count }
    }
    submissionCalendar
  }
  recentAcSubmissionList(username: $username, limit: 4) {
    title
    timestamp
  }
}`;

let cache: { data: LeetcodeStats; expiresAt: number } | null = null;

function computeStreak(submissionCalendar: string): number {
  let calendar: Record<string, number>;
  try {
    calendar = JSON.parse(submissionCalendar);
  } catch {
    return 0;
  }
  const daySeconds = 86400;
  const todayEpochDay = Math.floor(Date.now() / 1000 / daySeconds);
  let streak = 0;
  // Allow "today" to be empty (visitor might check before Chirag's solved today)
  // without breaking the streak — start from yesterday if today has no entry.
  let day = calendar[String(todayEpochDay * daySeconds)] ? todayEpochDay : todayEpochDay - 1;
  while (calendar[String(day * daySeconds)] > 0) {
    streak++;
    day--;
  }
  return streak;
}

export async function getLeetcodeStats(): Promise<LeetcodeStats> {
  if (cache && cache.expiresAt > Date.now()) return cache.data;

  const res = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: QUERY, variables: { username: LEETCODE_USERNAME } }),
    next: { revalidate: 600 },
  });
  if (!res.ok) throw new Error(`LeetCode API ${res.status}`);
  const json = await res.json();
  const matched = json?.data?.matchedUser;
  if (!matched) throw new Error("LeetCode user not found");

  const byDifficulty = new Map<string, number>(
    matched.submitStats.acSubmissionNum.map((e: { difficulty: string; count: number }) => [
      e.difficulty,
      e.count,
    ])
  );

  const recentAc: { title: string; timestamp: string }[] = json?.data?.recentAcSubmissionList ?? [];

  const data: LeetcodeStats = {
    easy: byDifficulty.get("Easy") ?? 0,
    medium: byDifficulty.get("Medium") ?? 0,
    hard: byDifficulty.get("Hard") ?? 0,
    streak: computeStreak(matched.submissionCalendar),
    ranking: matched.profile?.ranking ?? null,
    recentSolves: recentAc.map((s) => ({
      title: s.title,
      when: relativeTime(Number(s.timestamp) * 1000),
    })),
  };

  cache = { data, expiresAt: Date.now() + CACHE_TTL_MS };
  return data;
}
