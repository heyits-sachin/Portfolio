import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// In-memory cache for external APIs to prevent rate limits
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}
const cache: Record<string, CacheEntry<unknown>> = {};
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes for GitHub
const LEETCODE_CACHE_TTL_MS = 30 * 1000; // 30 seconds for live LeetCode updates

function getCached<T>(key: string, ttlMs = CACHE_TTL_MS): T | null {
  const entry = cache[key];
  if (entry && Date.now() - entry.timestamp < ttlMs) {
    return entry.data as T;
  }
  return null;
}

function setCache<T>(key: string, data: T): void {
  cache[key] = { data, timestamp: Date.now() };
}

// LeetCode API Endpoint
app.get('/api/leetcode', async (req: Request, res: Response) => {
  const forceRefresh = req.query.refresh === '1' || req.query.refresh === 'true';
  if (!forceRefresh) {
    const cached = getCached('leetcode_sachin', LEETCODE_CACHE_TTL_MS);
    if (cached) {
      return res.json(cached);
    }
  }

  try {
    const graphqlQuery = {
      query: `query getUserProfile($username: String!) {
        allQuestionsCount {
          difficulty
          count
        }
        recentAcSubmissionList(username: $username, limit: 5) {
          id
          title
          titleSlug
          timestamp
        }
        matchedUser(username: $username) {
          username
          submitStats: submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
          profile {
            ranking
            reputation
            starRating
          }
          userCalendar {
            streak
            totalActiveDays
            submissionCalendar
          }
          badges {
            id
            name
            displayName
            icon
            hoverText
          }
        }
      }`,
      variables: { username: 'sachin8147-star' },
    };

    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      body: JSON.stringify(graphqlQuery),
    });

    if (response.ok) {
      const json = await response.json();
      const user = json.data?.matchedUser;
      const allCounts = json.data?.allQuestionsCount || [];
      const recentList = json.data?.recentAcSubmissionList || [];

      if (user) {
        const stats = user.submitStats?.acSubmissionNum || [];
        const all = stats.find((s: { difficulty: string }) => s.difficulty === 'All')?.count ?? 133;
        const easy = stats.find((s: { difficulty: string }) => s.difficulty === 'Easy')?.count ?? 62;
        const medium = stats.find((s: { difficulty: string }) => s.difficulty === 'Medium')?.count ?? 59;
        const hard = stats.find((s: { difficulty: string }) => s.difficulty === 'Hard')?.count ?? 12;

        const totalAll = allCounts.find((c: { difficulty: string }) => c.difficulty === 'All')?.count ?? 4101;
        const totalEasy = allCounts.find((c: { difficulty: string }) => c.difficulty === 'Easy')?.count ?? 975;
        const totalMedium = allCounts.find((c: { difficulty: string }) => c.difficulty === 'Medium')?.count ?? 2139;
        const totalHard = allCounts.find((c: { difficulty: string }) => c.difficulty === 'Hard')?.count ?? 987;

        let parsedCalendar: Record<string, number> = {};
        try {
          if (user.userCalendar?.submissionCalendar) {
            parsedCalendar = JSON.parse(user.userCalendar.submissionCalendar);
          }
        } catch {
          // ignore parsing error
        }

        const data = {
          username: user.username,
          totalSolved: all,
          totalQuestions: totalAll,
          easySolved: easy,
          totalEasy,
          mediumSolved: medium,
          totalMedium,
          hardSolved: hard,
          totalHard,
          ranking: user.profile?.ranking ?? 1347085,
          streak: user.userCalendar?.streak ?? 51,
          totalActiveDays: user.userCalendar?.totalActiveDays ?? 94,
          reputation: user.profile?.reputation ?? 0,
          badges: user.badges || [],
          submissionCalendar: parsedCalendar,
          recentSubmissions: Array.isArray(recentList) ? recentList.slice(0, 5) : [],
          lastSynced: new Date().toISOString(),
          isLive: true,
        };

        setCache('leetcode_sachin', data);
        return res.json(data);
      }
    }
  } catch (err) {
    console.warn('LeetCode fetch error, using fallback:', err);
  }

  // Graceful verified fallback if offline
  const cachedStale = cache['leetcode_sachin']?.data;
  if (cachedStale) {
    return res.json(cachedStale);
  }

  const fallback = {
    username: 'sachin8147-star',
    totalSolved: 133,
    totalQuestions: 4101,
    easySolved: 62,
    totalEasy: 975,
    mediumSolved: 59,
    totalMedium: 2139,
    hardSolved: 12,
    totalHard: 987,
    ranking: 1347085,
    streak: 51,
    totalActiveDays: 94,
    badges: [
      {
        id: '10664857',
        name: 'Annual Badge',
        displayName: '50 Days Badge 2026',
        icon: 'https://assets.leetcode.com/static_assets/others/50_1080_1080.png',
        hoverText: '50 Days Badge 2026',
      },
    ],
    recentSubmissions: [
      {
        id: '2189800024',
        title: 'Find the Distance Value Between Two Arrays',
        titleSlug: 'find-the-distance-value-between-two-arrays',
        timestamp: '1793853687',
      },
      {
        id: '2187738669',
        title: 'Minimum Moves to Equal Array Elements II',
        titleSlug: 'minimum-moves-to-equal-array-elements-ii',
        timestamp: '1793622776',
      },
      {
        id: '2186736105',
        title: 'Minimum Moves to Equal Array Elements',
        titleSlug: 'minimum-moves-to-equal-array-elements',
        timestamp: '1793511372',
      },
      {
        id: '2186194602',
        title: 'Sqrt(x)',
        titleSlug: 'sqrtx',
        timestamp: '1793451871',
      },
      {
        id: '2184706916',
        title: 'Remove Duplicates from Sorted Array',
        titleSlug: 'remove-duplicates-from-sorted-array',
        timestamp: '1793277951',
      },
    ],
    lastSynced: new Date().toISOString(),
    isLive: false,
  };
  return res.json(fallback);
});

// GitHub Repos Endpoint
app.get('/api/github/repos', async (_req: Request, res: Response) => {
  const cached = getCached('github_repos');
  if (cached) return res.json(cached);

  try {
    const response = await fetch('https://api.github.com/users/heyits-sachin/repos?sort=pushed&per_page=30', {
      headers: {
        'User-Agent': 'Sachin-Portfolio-App',
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data)) {
        const cleaned = data
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
            description: repo.description,
            htmlUrl: repo.html_url,
            homepage: repo.homepage,
            language: repo.language,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            updatedAt: repo.updated_at,
          }));

        setCache('github_repos', cleaned);
        return res.json(cleaned);
      }
    }
  } catch (err) {
    console.warn('GitHub repos error:', err);
  }

  return res.json([]);
});

// GitHub Activity Endpoint
app.get('/api/github/activity', async (_req: Request, res: Response) => {
  const cached = getCached('github_activity');
  if (cached) return res.json(cached);

  try {
    const response = await fetch('https://api.github.com/users/heyits-sachin/events/public?per_page=15', {
      headers: {
        'User-Agent': 'Sachin-Portfolio-App',
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data)) {
        const events = data.map((ev: {
          id: string;
          type: string;
          repo: { name: string };
          created_at: string;
          payload: {
            commits?: Array<{ message: string }>;
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

        setCache('github_activity', events);
        return res.json(events);
      }
    }
  } catch (err) {
    console.warn('GitHub activity error:', err);
  }

  return res.json([]);
});

// GitHub Contributions Calendar Endpoint
app.get('/api/github/contributions', async (_req: Request, res: Response) => {
  const cached = getCached('github_contributions');
  if (cached) return res.json(cached);

  try {
    const response = await fetch('https://github-contributions-api.jogruber.de/v4/heyits-sachin?y=last', {
      headers: {
        'User-Agent': 'Sachin-Portfolio-App',
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data && Array.isArray(data.contributions)) {
        const calendar: Record<string, number> = {};
        for (const entry of data.contributions) {
          if (entry.date && typeof entry.count === 'number' && entry.count > 0) {
            calendar[entry.date] = entry.count;
          }
        }
        const payload = {
          total: data.total?.lastYear || Object.values(calendar).reduce((a, b) => a + b, 0),
          calendar,
          isLive: true,
        };
        setCache('github_contributions', payload);
        return res.json(payload);
      }
    }
  } catch (err) {
    console.warn('GitHub contributions fetch error:', err);
  }

  return res.json({ total: 0, calendar: {}, isLive: false });
});

// Frontend Vite Integration
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
