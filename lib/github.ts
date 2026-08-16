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

type PushEvent = {
  type: string;
  created_at: string;
  repo: { name: string };
  payload: { commits?: { sha: string; message: string }[] };
};

function relativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${Math.max(mins, 1)}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

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

export async function getGithubStats(): Promise<GithubStats> {
  if (cache && cache.expiresAt > Date.now()) return cache.data;

  const [repos, events, contribData] = await Promise.all([
    ghFetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=pushed`) as Promise<Repo[]>,
    ghFetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=30`) as Promise<PushEvent[]>,
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

  const commits = events
    .filter((e) => e.type === "PushEvent" && e.payload.commits?.length)
    .flatMap((e) =>
      (e.payload.commits ?? []).map((c) => ({
        hash: c.sha.slice(0, 7),
        msg: c.message.split("\n")[0].slice(0, 60),
        when: relativeTime(e.created_at),
      }))
    )
    .slice(0, 4);

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
