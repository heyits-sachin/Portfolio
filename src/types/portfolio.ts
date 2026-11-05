export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: 'Full-Stack' | 'SaaS & Web' | 'AI / ML' | 'Tools & Systems';
  description: string;
  longDescription?: string;
  highlights: string[];
  metrics?: { label: string; value: string }[];
  tags: string[];
  host?: string;
  githubUrl?: string;
  liveUrl?: string;
  previewUrl?: string;
  imageUrl?: string;
  featured: boolean;
  accentColor?: string;
}

export interface LeetCodeStats {
  username: string;
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  ranking: number;
  streak: number;
  totalActiveDays: number;
  reputation?: number;
  badges?: Array<{
    id: string;
    displayName: string;
    icon: string;
    hoverText: string;
  }>;
  submissionCalendar?: Record<string, number>;
  recentSubmissions?: Array<{
    id: string;
    title: string;
    titleSlug: string;
    timestamp: string;
  }>;
  lastSynced: string;
  isLive: boolean;
}

export interface GitHubRepo {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
  isRecent?: boolean;
}

export interface GitHubActivityEvent {
  id: string;
  type: string;
  repoName: string;
  repoUrl: string;
  createdAt: string;
  description: string;
  commits?: string[];
}

export interface WorkExperience {
  period: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string[];
  skills: string[];
}
