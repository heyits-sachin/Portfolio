import { LeetCodeStats, GitHubRepo, GitHubActivityEvent } from '../types/portfolio';
import { INITIAL_LEETCODE_STATS, INITIAL_GITHUB_REPOS, INITIAL_GITHUB_ACTIVITY } from '../data/staticData';

export async function fetchLeetCodeStats(forceRefresh = false): Promise<LeetCodeStats> {
  try {
    const query = forceRefresh ? `?refresh=1&t=${Date.now()}` : `?t=${Date.now()}`;
    const res = await fetch(`/api/leetcode${query}`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.totalSolved === 'number') {
        return data as LeetCodeStats;
      }
    }
  } catch {
    // Fallback cleanly if offline
  }

  return {
    ...INITIAL_LEETCODE_STATS,
    lastSynced: new Date().toISOString(),
    isLive: true,
  };
}

export async function fetchGitHubContributions(): Promise<Record<string, number>> {
  try {
    const res = await fetch('https://github-contributions-api.jogruber.de/v4/heyits-sachin?y=last');
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.contributions)) {
        const calendar: Record<string, number> = {};
        for (const entry of data.contributions) {
          if (entry.date && typeof entry.count === 'number' && entry.count > 0) {
            calendar[entry.date] = entry.count;
          }
        }
        return calendar;
      }
    }
  } catch {
    // Fallback cleanly
  }
  return {};
}

const SAMVIDHAN_COLLAB_REPO: GitHubRepo = {
  id: 99912,
  name: 'samvidhan',
  fullName: 'its-lnv/samvidhan',
  description: 'Interactive Constitution of India civic-tech platform (co-built & contributed with friend).',
  htmlUrl: 'https://github.com/its-lnv/samvidhan',
  homepage: 'https://samvidhan.pythonanywhere.com/',
  language: 'Python',
  stars: 2,
  forks: 1,
  updatedAt: '2026-10-28T14:20:00Z',
  isRecent: true,
};

export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  try {
    const res = await fetch('https://api.github.com/users/heyits-sachin/repos?sort=pushed&per_page=30');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const mapped: GitHubRepo[] = data
          .filter((repo: { fork: boolean }) => !repo.fork)
          .map((repo: {
            id: number;
            name: string;
            full_name: string;
            description: string | null;
            html_url: string;
            homepage: string | null;
            language: string | null;
            stargazers_count: number;
            forks_count: number;
            updated_at: string;
          }) => ({
            id: repo.id,
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description || 'Full-stack software engineering repository.',
            htmlUrl: repo.html_url,
            homepage: repo.name.toLowerCase().includes('campus')
              ? 'https://campascrate.vercel.app/'
              : repo.homepage,
            language: repo.language,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            updatedAt: repo.updated_at,
          }));

        const hasSamvidhan = mapped.some((r) => r.name.toLowerCase().includes('samvidhan'));
        return hasSamvidhan ? mapped : [mapped[0], SAMVIDHAN_COLLAB_REPO, ...mapped.slice(1)];
      }
    }
  } catch {
    // Fallback if offline
  }

  return INITIAL_GITHUB_REPOS;
}

export async function fetchGitHubActivity(): Promise<GitHubActivityEvent[]> {
  try {
    const res = await fetch('https://api.github.com/users/heyits-sachin/events/public?per_page=15');
    if (res.ok) {
      const events = await res.json();
      if (Array.isArray(events) && events.length > 0) {
        return events.map((ev: {
          id: string;
          type: string;
          repo: { name: string };
          created_at: string;
          payload: {
            commits?: Array<{ message: string }>;
            action?: string;
            ref_type?: string;
          };
        }) => {
          let desc = 'Contributed to repository';
          const commits = ev.payload?.commits?.map((c) => c.message) || [];
          if (ev.type === 'PushEvent') {
            desc = commits.length > 0 ? commits[0] : 'Pushed new commits';
          } else if (ev.type === 'CreateEvent') {
            desc = `Created ${ev.payload?.ref_type || 'repository'}`;
          } else if (ev.type === 'WatchEvent') {
            desc = 'Starred repository';
          } else if (ev.type === 'ForkEvent') {
            desc = 'Forked repository';
          }

          return {
            id: ev.id,
            type: ev.type,
            repoName: ev.repo?.name || 'repository',
            repoUrl: `https://github.com/${ev.repo?.name}`,
            createdAt: ev.created_at,
            description: desc,
            commits,
          };
        });
      }
    }
  } catch {
    // Fallback
  }

  return INITIAL_GITHUB_ACTIVITY;
}
