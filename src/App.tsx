import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { DisciplinesSection } from './components/DisciplinesSection';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { FeaturedProjects } from './components/FeaturedProjects';
import { DreamArchiveSection } from './components/DreamArchiveSection';
import { LeetCodeActivity } from './components/LeetCodeActivity';
import { GitHubActivity } from './components/GitHubActivity';
import { TechStack } from './components/TechStack';
import { EducationSection } from './components/EducationSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { GSAPController } from './components/GSAPController';
import { MarqueeRibbon } from './components/MarqueeRibbon';
import { BackgroundFlowfield } from './components/BackgroundFlowfield';
import { DaikiCrystalCanvas } from './components/DaikiCrystalCanvas';
import { AllProjectsPage } from './components/AllProjectsPage';

import {
  FEATURED_PROJECTS,
  INITIAL_LEETCODE_STATS,
  INITIAL_GITHUB_REPOS,
  INITIAL_GITHUB_ACTIVITY,
} from './data/staticData';
import { LeetCodeStats, GitHubRepo, GitHubActivityEvent, Project } from './types/portfolio';
import {
  fetchLeetCodeStats,
  fetchGitHubRepos,
  fetchGitHubActivity,
  fetchGitHubContributions,
} from './services/api';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'all-projects'>(() => {
    return window.location.hash === '#all-projects' ? 'all-projects' : 'home';
  });

  // Default to DREAM dark mode (#07081A cosmic indigo/violet) matching user's reference screenshots
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('portfolio-theme-v3');
      if (saved) return saved === 'dark';
    } catch {
      // ignore
    }
    return true;
  });

  const [leetCodeStats, setLeetCodeStats] = useState<LeetCodeStats>(INITIAL_LEETCODE_STATS);
  const [gitHubRepos, setGitHubRepos] = useState<GitHubRepo[]>(INITIAL_GITHUB_REPOS);
  const [gitHubActivity, setGitHubActivity] = useState<GitHubActivityEvent[]>(INITIAL_GITHUB_ACTIVITY);
  const [gitHubContributions, setGitHubContributions] = useState<Record<string, number>>({});
  const [projectsList] = useState<Project[]>(FEATURED_PROJECTS);
  const [isRefreshingData, setIsRefreshingData] = useState<boolean>(false);

  // Sync hash changes
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#all-projects') {
        setCurrentView('all-projects');
      } else if (!window.location.hash || window.location.hash === '#top') {
        setCurrentView('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Sync theme with document element
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('portfolio-theme-v3', isDark ? 'dark' : 'light');
    } catch {
      // ignore
    }
  }, [isDark]);

  // Load live data on mount and when user triggers refresh or returns to tab
  const loadAllLiveData = async (forceRefresh = false) => {
    setIsRefreshingData(true);
    try {
      const [lcData, reposData, activityData, contribData] = await Promise.all([
        fetchLeetCodeStats(forceRefresh),
        fetchGitHubRepos(),
        fetchGitHubActivity(),
        fetchGitHubContributions(),
      ]);

      if (lcData) setLeetCodeStats(lcData);
      if (reposData && reposData.length > 0) setGitHubRepos(reposData);
      if (activityData && activityData.length > 0) setGitHubActivity(activityData);
      if (contribData && Object.keys(contribData).length > 0) setGitHubContributions(contribData);
    } catch (err) {
      console.warn('Live sync error:', err);
    } finally {
      setIsRefreshingData(false);
    }
  };

  useEffect(() => {
    loadAllLiveData(false);

    // Automatically re-fetch live LeetCode stats when user switches back to this tab after solving a question
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchLeetCodeStats(true)
          .then((freshLc) => {
            if (freshLc) setLeetCodeStats(freshLc);
          })
          .catch(() => {
            // ignore background sync error
          });
      }
    };

    const pollInterval = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchLeetCodeStats(false)
          .then((freshLc) => {
            if (freshLc) setLeetCodeStats(freshLc);
          })
          .catch(() => {
            // ignore background sync error
          });
      }
    }, 60000);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.clearInterval(pollInterval);
    };
  }, []);

  const navigateToAllProjects = () => {
    window.location.hash = 'all-projects';
    setCurrentView('all-projects');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    window.location.hash = '';
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentView === 'all-projects') {
    return (
      <AllProjectsPage
        featuredProjects={projectsList}
        githubRepos={gitHubRepos}
        onBack={navigateToHome}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#07081A] dark:bg-[#07081A] light:bg-[#ECEAE4] text-neutral-100 dark:text-neutral-100 light:text-[#141413] transition-colors duration-500 relative overflow-x-hidden">
      {/* GSAP Controller: [ ENTER ] Intro Screen, Custom Cursor & 3D Deep-Scroll */}
      <GSAPController />

      {/* Daiki Fujita Inspired Atmospheric Sky & Color Drift Layer */}
      <div className="fixed inset-0 pointer-events-none daiki-sky-aura z-0" aria-hidden="true" />

      {/* Daiki Fujita 8-Column Architectural Vertical Grid Hairlines (matches 00:07 - 00:46 in video) */}
      <div
        className="fixed inset-0 pointer-events-none z-0 max-w-[1440px] mx-auto px-4 sm:px-8 grid grid-cols-4 md:grid-cols-8 opacity-[0.06] dark:opacity-[0.06] light:opacity-[0.08]"
        aria-hidden="true"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="border-l border-indigo-200 dark:border-indigo-200 light:border-neutral-900 h-full last:border-r"
          />
        ))}
      </div>

      {/* Daiki Fujita Interactive 3D Refractive Crystal Sculpture, Shards, Circular Text Ring, Purple Liquid Ink Trail & 8-Bit Pixel Follower */}
      <DaikiCrystalCanvas isDark={isDark} />

      {/* Subtle Film Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none daiki-grain z-30" aria-hidden="true" />

      {/* Top Header + Fixed Bottom WAKE / DREAM Pill */}
      <Header
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
      />

      {/* Main Content Area */}
      <main id="top" className="relative z-10">
        <Hero
          isDark={isDark}
          totalSolved={leetCodeStats.totalSolved}
        />

        {/* Marquee Ribbon with Real Tech Logos */}
        <MarqueeRibbon />

        {/* [01] ABOUT ("I DESIGN AND BUILD APPLICATIONS THAT STAY WITH YOU LIKE A memory...") */}
        <AboutSection isDark={isDark} />

        {/* [02] DISCIPLINES (Progressive Blur-to-Focus Stack: (01) to (04)) */}
        <DisciplinesSection />

        {/* [03] SELECTED WORKS (Horizontal Showcase + 01 / 06 Counter + Circular OPEN Button + Deep Z-Grid) */}
        <FeaturedProjects
          projects={projectsList}
          onViewAllProjects={navigateToAllProjects}
          totalProjectsCount={projectsList.length + gitHubRepos.length}
        />

        {/* [04] DREAM MODE ("There is another way ... to see this archive." + Electric Purple Singularity Portal) */}
        <DreamArchiveSection
          isDark={isDark}
          onEnterDreamMode={() => setIsDark(true)}
          onViewAllProjects={navigateToAllProjects}
        />

        <ExperienceTimeline />

        <LeetCodeActivity
          stats={leetCodeStats}
          onRefresh={loadAllLiveData}
          isRefreshing={isRefreshingData}
        />

        <GitHubActivity
          repos={gitHubRepos}
          activity={gitHubActivity}
          contributionsCalendar={gitHubContributions}
          onRefresh={loadAllLiveData}
          isRefreshing={isRefreshingData}
        />

        <TechStack totalSolved={leetCodeStats.totalSolved} />

        <EducationSection />

        {/* SAY HELLO. + Recognition Ledger + Quick Message Composer */}
        <ContactSection
          totalSolved={leetCodeStats.totalSolved}
          onToggleDream={() => setIsDark((prev) => !prev)}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
