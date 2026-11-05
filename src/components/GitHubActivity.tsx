import React, { useState, useMemo, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, Star, ExternalLink, RefreshCw, GitCommit, Users } from 'lucide-react';
import { GitHubRepo, GitHubActivityEvent } from '../types/portfolio';
import { buildContributionGrid, ContributionDay } from '../utils/formatters';
import { soundEngine } from '../utils/soundEngine';

gsap.registerPlugin(ScrollTrigger);

interface GitHubActivityProps {
  repos: GitHubRepo[];
  activity: GitHubActivityEvent[];
  contributionsCalendar?: Record<string, number>;
  onRefresh: (forceRefresh?: boolean) => Promise<void>;
  isRefreshing: boolean;
}

export const GitHubActivity: React.FC<GitHubActivityProps> = ({
  repos,
  contributionsCalendar,
  onRefresh,
  isRefreshing,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);
  const repoGridRef = useRef<HTMLDivElement | null>(null);

  const languages = ['All', 'Python', 'TypeScript', 'JavaScript'];

  const grid = useMemo(
    () => buildContributionGrid(contributionsCalendar, 'github'),
    [contributionsCalendar]
  );

  const filteredRepos = useMemo(() => {
    const base =
      selectedLanguage === 'All'
        ? repos
        : repos.filter((r) => r.language?.toLowerCase() === selectedLanguage.toLowerCase());
    return base.slice(0, 6);
  }, [repos, selectedLanguage]);

  // Smoothly reveal repository cards when live GitHub repos load or language filter changes
  useEffect(() => {
    const container = repoGridRef.current;
    if (!container) return;
    const cards = container.querySelectorAll<HTMLElement>('.gsap-stagger-item');
    if (cards.length > 0) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 18, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
          stagger: 0.05,
          ease: 'power2.out',
          overwrite: 'auto',
        }
      );
    }
    ScrollTrigger.refresh();
  }, [filteredRepos, contributionsCalendar]);

  const getLevelClass = (level: 0 | 1 | 2 | 3 | 4) => {
    switch (level) {
      case 0:
        return 'bg-neutral-900/90 dark:bg-neutral-900/90 light:bg-stone-200/80 border-neutral-800/60 dark:border-neutral-800/60 light:border-stone-300/60';
      case 1:
        return 'bg-emerald-950/80 dark:bg-emerald-950/80 light:bg-emerald-200 border-emerald-800/50';
      case 2:
        return 'bg-emerald-700/75 dark:bg-emerald-700/75 light:bg-emerald-400 border-emerald-500/50';
      case 3:
        return 'bg-emerald-500 dark:bg-emerald-500 light:bg-emerald-500 border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.35)]';
      case 4:
        return 'bg-emerald-300 dark:bg-emerald-300 light:bg-emerald-600 border-emerald-200 shadow-[0_0_12px_rgba(110,231,183,0.65)]';
    }
  };

  return (
    <section id="activity" className="depth-section py-16 sm:py-20 max-w-6xl mx-auto px-4 sm:px-8 relative">
      <div className="pointer-events-none absolute top-1/3 right-10 w-96 h-96 rounded-full bg-indigo-600/10 blur-[130px] -z-10" />

      {/* Section Header */}
      <div className="gsap-reveal flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 text-xs font-mono tracking-widest uppercase text-amber-500 mb-2">
            <span className="text-neutral-500">(04)</span>
            <span className="w-6 h-px bg-amber-500" />
            <span>Open Source &amp; Contributions</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-normal text-neutral-100 dark:text-neutral-100 light:text-neutral-900 tracking-tight">
            GitHub <span className="font-serif italic text-amber-500 dark:text-amber-400">contributions.</span>
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              soundEngine.playClick();
              onRefresh(true);
            }}
            onMouseEnter={() => soundEngine.playHover()}
            disabled={isRefreshing}
            aria-label="Refresh GitHub activity"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono font-medium rounded-lg border border-neutral-800 dark:border-neutral-800 light:border-stone-300 bg-neutral-900/60 dark:bg-neutral-900/60 light:bg-stone-100 text-neutral-300 dark:text-neutral-300 light:text-neutral-700 hover:border-amber-500/50 hover:text-amber-400 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-500' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync GitHub'}</span>
          </button>

          <a
            href="https://github.com/heyits-sachin"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => soundEngine.playHover()}
            onClick={() => soundEngine.playClick()}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-neutral-100 dark:bg-neutral-100 light:bg-neutral-900 text-neutral-950 dark:text-neutral-950 light:text-white hover:bg-amber-500 dark:hover:bg-amber-400 transition-colors whitespace-nowrap"
          >
            <Github className="w-3.5 h-3.5" />
            <span>@heyits-sachin</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Main GitHub Contribution Graph Card */}
      <div className="gsap-reveal rounded-3xl border border-neutral-800/80 dark:border-neutral-800/80 light:border-stone-200 bg-[#0E1020]/80 dark:bg-[#0E1020]/80 light:bg-stone-50 p-5 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        {/* Top Summary Header */}
        <div className="gsap-reveal flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800/80 dark:border-neutral-800/80 light:border-stone-200">
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <div className="text-3xl sm:text-5xl font-serif italic text-emerald-400 dark:text-emerald-400 light:text-emerald-600 tabular-nums leading-none">
                {grid.totalContributions}
              </div>
              <div className="text-xs font-mono text-neutral-400 dark:text-neutral-400 light:text-neutral-600 mt-1">
                contributions in the last year
              </div>
            </div>

            <div className="h-8 w-px bg-neutral-800 hidden sm:block" />

            <div>
              <div className="text-3xl sm:text-5xl font-serif italic text-neutral-100 dark:text-neutral-100 light:text-neutral-900 tabular-nums leading-none">
                {repos.length}
              </div>
              <div className="text-xs font-mono text-neutral-400 dark:text-neutral-400 light:text-neutral-600 mt-1">
                public &amp; collaborative repos
              </div>
            </div>

            <div className="h-8 w-px bg-neutral-800 hidden sm:block" />

            <div>
              <div className="text-3xl sm:text-5xl font-serif italic text-amber-400 tabular-nums leading-none">
                {grid.activeDays}
              </div>
              <div className="text-xs font-mono text-neutral-400 dark:text-neutral-400 light:text-neutral-600 mt-1">
                active commit days
              </div>
            </div>
          </div>

          {/* Interactive Hover Readout */}
          <div className="text-xs font-mono text-neutral-400 dark:text-neutral-400 light:text-neutral-600 flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-emerald-400 shrink-0" />
            {hoveredDay ? (
              <span className="text-emerald-400 font-medium">
                {hoveredDay.count} {hoveredDay.count === 1 ? 'contribution' : 'contributions'} on {hoveredDay.formattedDate}
              </span>
            ) : (
              <span>Hover any square to inspect commit activity</span>
            )}
          </div>
        </div>

        {/* 52-Week GitHub Contribution Heatmap */}
        <div className="gsap-reveal py-7 border-b border-neutral-800/80 dark:border-neutral-800/80 light:border-stone-200">
          <div className="overflow-x-auto pb-2">
            <div className="min-w-[720px]">
              {/* Month Labels */}
              <div className="flex items-center pl-8 mb-1.5 text-[10px] font-mono text-neutral-400 dark:text-neutral-400 light:text-neutral-600">
                {grid.weeks.map((week) => (
                  <div key={week.weekIndex} className="flex-1 min-w-[12px] text-left">
                    {week.monthLabel || ''}
                  </div>
                ))}
              </div>

              {/* Weekday Labels + 52 Week Columns */}
              <div className="flex items-start gap-2">
                <div className="flex flex-col justify-between h-[96px] py-1 text-[10px] font-mono text-neutral-500 pr-1 select-none">
                  <span>Mon</span>
                  <span>Wed</span>
                  <span>Fri</span>
                </div>

                <div
                  className="flex-1 grid grid-cols-52 gap-[3px]"
                  style={{ gridTemplateColumns: 'repeat(52, minmax(0, 1fr))' }}
                  role="region"
                  aria-label="GitHub 52-week contribution graph"
                >
                  {grid.weeks.map((week) => (
                    <div key={week.weekIndex} className="flex flex-col gap-[3px]">
                      {week.days.map((day) => (
                        <div
                          key={day.date}
                          onMouseEnter={() => {
                            setHoveredDay(day);
                            if (day.count > 0) soundEngine.playHover();
                          }}
                          onMouseLeave={() => setHoveredDay(null)}
                          title={`${day.count} contributions on ${day.formattedDate}`}
                          className={`w-full aspect-square max-w-[13px] rounded-[3px] border transition-transform duration-150 hover:scale-125 hover:z-10 cursor-pointer ${getLevelClass(
                            day.level
                          )}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Language Distribution & Heatmap Legend */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 text-[11px] font-mono text-neutral-400 dark:text-neutral-400 light:text-neutral-600">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Python 58%</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                <span>TypeScript 18%</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
                <span>JavaScript 16%</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                <span>HTML/CSS &amp; Prolog 8%</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span>Less</span>
              {([0, 1, 2, 3, 4] as const).map((lvl) => (
                <span
                  key={lvl}
                  className={`w-3 h-3 rounded-[3px] border inline-block ${getLevelClass(lvl)}`}
                />
              ))}
              <span>More</span>
            </div>
          </div>
        </div>

        {/* Compact Top Repositories Strip */}
        <div className="pt-6">
          <div className="gsap-reveal flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-400 light:text-neutral-500">
              Pinned &amp; Collaborative Repositories
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    soundEngine.playClick();
                    setSelectedLanguage(lang);
                  }}
                  onMouseEnter={() => soundEngine.playHover()}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    selectedLanguage === lang
                      ? 'bg-amber-500 text-neutral-950 font-semibold'
                      : 'bg-neutral-950/50 dark:bg-neutral-950/50 light:bg-stone-200 text-neutral-400 dark:text-neutral-400 light:text-neutral-700 hover:text-neutral-200'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div ref={repoGridRef} className="gsap-stagger-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredRepos.map((repo) => {
              const isCollab = repo.fullName.startsWith('its-lnv/');
              return (
                <div
                  key={repo.id}
                  onMouseEnter={() => soundEngine.playHover()}
                  className="gsap-stagger-item p-4 rounded-2xl border border-neutral-800/70 dark:border-neutral-800/70 light:border-stone-200 bg-neutral-950/40 dark:bg-neutral-950/40 light:bg-white flex flex-col justify-between gap-3 hover:border-amber-500/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <a
                        href={repo.htmlUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => soundEngine.playClick()}
                        className="text-sm font-semibold text-neutral-100 dark:text-neutral-100 light:text-neutral-900 hover:text-amber-400 transition-colors truncate"
                      >
                        {isCollab ? repo.fullName : repo.name}
                      </a>

                      {repo.homepage && (
                        <a
                          href={repo.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => soundEngine.playClick()}
                          aria-label={`Open live deployment for ${repo.name}`}
                          className="text-[10px] font-mono text-emerald-400 hover:underline flex items-center gap-0.5 shrink-0"
                        >
                          <span>live</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>

                    <p className="text-xs text-neutral-400 dark:text-neutral-400 light:text-neutral-600 line-clamp-2 leading-relaxed">
                      {repo.description || 'Full-stack software engineering repository.'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 pt-2 border-t border-neutral-800/50 dark:border-neutral-800/50 light:border-stone-200">
                    <div className="flex items-center gap-2">
                      {repo.language && <span className="text-amber-400">{repo.language}</span>}
                      {isCollab && (
                        <span className="inline-flex items-center gap-1 text-indigo-400">
                          <Users className="w-3 h-3" />
                          <span>Co-built</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5">
                      {repo.stars > 0 && (
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span>{repo.stars}</span>
                        </span>
                      )}
                      <a
                        href={repo.htmlUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${repo.name} on GitHub`}
                        className="hover:text-white transition-colors"
                      >
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
