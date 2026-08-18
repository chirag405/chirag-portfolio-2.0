import { relativeTime } from "@/lib/relative-time";

const GITHUB_USERNAME = "chirag405";
const CACHE_TTL_MS = 5 * 60 * 1000;

export type GithubStats = {
  repos: number;
  stars: number;
  contributions: number | null;
  streak: number | null;
  languages: { name: string; pct: number }[];
  commits: { hash: string; msg: string; when: string }[];
  /** Real daily contribution counts (most recent ~52 weeks), only when GITHUB_TOKEN is set. */
  calendar: number[][] | null;
};

type Repo = {
  name: string;
  stargazers_count: number;
  language: string | null;
  fork: boolean;
};

type CommitApiEntry = {
  sha: string;
  commit: { message: string; author: { date: string } | null };
};

async function ghFetch(url: string) {
  const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  const res = await fetch(url, { headers, next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`GitHub API ${res.status} for ${url}`);
  return res.json();
}

async function fetchContributionsAndStreak(): Promise<{
  contributions: number | null;
  streak: number | null;
  calendar: number[][] | null;
}> {
  if (!process.env.GITHUB_TOKEN) return { contributions: null, streak: null, calendar: null };

  const query = `query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date contributionCount } }
        }
      }
    }
  }`;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables: { login: GITHUB_USERNAME } }),
      next: { revalidate: 300 },
    });
    if (!res.ok) return { contributions: null, streak: null, calendar: null };
    const json = await res.json();
    const gqlCalendar = json?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!gqlCalendar) return { contributions: null, streak: null, calendar: null };

    const weeks: { contributionDays: { date: string; contributionCount: number }[] }[] =
      gqlCalendar.weeks;
    const days = weeks.flatMap((w) => w.contributionDays);
    let streak = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].contributionCount > 0) streak++;
      else break;
    }
    const calendar = weeks.map((w) => w.contributionDays.map((d) => d.contributionCount));
    return { contributions: gqlCalendar.totalContributions, streak, calendar };
  } catch {
    return { contributions: null, streak: null, calendar: null };
  }
}

let cache: { data: GithubStats; expiresAt: number } | null = null;

/**
 * GitHub's public events feed stopped including `payload.commits[]` on
 * PushEvents (it now only has ref/head/before), so "recent commits" is
 * pulled straight from the commits endpoint of the most recently pushed
 * repos instead — real messages/dates, no per-event extra fetch needed.
 */
async function fetchRecentCommits(
  repos: Repo[],
): Promise<{ hash: string; msg: string; when: string }[]> {
  const candidates = repos.filter((r) => !r.fork).slice(0, 3);
  const perRepo = await Promise.all(
    candidates.map(async (r) => {
      try {
        const commits = (await ghFetch(
          `https://api.github.com/repos/${GITHUB_USERNAME}/${r.name}/commits?per_page=3`,
        )) as CommitApiEntry[];
        return commits.map((c) => ({
          hash: c.sha.slice(0, 7),
          msg: c.commit.message.split("\n")[0].slice(0, 60),
          date: c.commit.author?.date ?? new Date(0).toISOString(),
        }));
      } catch {
        return [];
      }
    }),
  );
  return perRepo
    .flat()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4)
    .map((c) => ({ hash: c.hash, msg: c.msg, when: relativeTime(c.date) }));
}

export async function getGithubStats(): Promise<GithubStats> {
  if (cache && cache.expiresAt > Date.now()) return cache.data;

  const repos = (await ghFetch(
    `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=pushed`,
  )) as Repo[];

  const [commits, contribData] = await Promise.all([
    fetchRecentCommits(repos),
    fetchContributionsAndStreak(),
  ]);

  const nonForkRepos = repos.filter((r) => !r.fork);
  const stars = nonForkRepos.reduce((sum, r) => sum + (r.stargazers_count ?? 0), 0);

  const langCounts = new Map<string, number>();
  for (const r of nonForkRepos) {
    if (!r.language) continue;
    langCounts.set(r.language, (langCounts.get(r.language) ?? 0) + 1);
  }
  const totalLangRepos = Array.from(langCounts.values()).reduce((a, b) => a + b, 0);
  const languages = Array.from(langCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({
      name,
      pct: totalLangRepos > 0 ? Math.round((count / totalLangRepos) * 100) : 0,
    }));

  const data: GithubStats = {
    repos: repos.length,
    stars,
    contributions: contribData.contributions,
    streak: contribData.streak,
    languages,
    commits,
    calendar: contribData.calendar,
  };

  cache = { data, expiresAt: Date.now() + CACHE_TTL_MS };
  return data;
}
