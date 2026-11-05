// Vercel Serverless Function handler for /api/leetcode
export default async function handler(req: any, res: any) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
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
      const json: any = await response.json();
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

        return res.status(200).json(data);
      }
    }
  } catch (err) {
    console.warn('Vercel LeetCode fetch error, using fallback:', err);
  }

  // Fallback data
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

  return res.status(200).json(fallback);
}
