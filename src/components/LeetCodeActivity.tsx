import React, { useState, useMemo } from 'react';
import { RefreshCw, ExternalLink, Flame, Trophy, Award, Calendar, CheckCircle2 } from 'lucide-react';
import { LeetCodeStats } from '../types/portfolio';
import {
  calculateProgressPercentage,
  formatNumberWithCommas,
  formatRelativeTime,
  buildContributionGrid,
  ContributionDay,
} from '../utils/formatters';
import { soundEngine } from '../utils/soundEngine';

interface LeetCodeActivityProps {
  stats: LeetCodeStats;
  onRefresh: (forceRefresh?: boolean) => Promise<void>;
  isRefreshing: boolean;
}

export const LeetCodeActivity: React.FC<LeetCodeActivityProps> = ({
  stats,
  onRefresh,
  isRefreshing,
}) => {
  const [syncedJustNow, setSyncedJustNow] = useState(false);
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);

  const handleManualSync = async () => {
    soundEngine.playClick();
    await onRefresh(true);
    setSyncedJustNow(true);
    setTimeout(() => setSyncedJustNow(false), 3000);
  };

  const grid = useMemo(
    () => buildContributionGrid(stats.submissionCalendar, 'leetcode'),
    [stats.submissionCalendar]
  );

  const easyPercent = calculateProgressPercentage(stats.easySolved, stats.totalEasy || 975);
  const medPercent = calculateProgressPercentage(stats.mediumSolved, stats.totalMedium || 2139);
  const hardPercent = calculateProgressPercentage(stats.hardSolved, stats.totalHard || 987);

  const getLevelClass = (level: 0 | 1 | 2 | 3 | 4) => {
    switch (level) {
      case 0:
        return 'bg-neutral-900/90 dark:bg-neutral-900/90 light:bg-stone-200/80 border-neutral-800/60 dark:border-neutral-800/60 light:border-stone-300/60';
      case 1:
        return 'bg-amber-900/50 dark:bg-amber-900/50 light:bg-amber-200 border-amber-700/40';
      case 2:
        return 'bg-amber-600/70 dark:bg-amber-600/70 light:bg-amber-400 border-amber-500/50';
      case 3:
        return 'bg-amber-500 dark:bg-amber-500 light:bg-amber-500 border-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.35)]';
      case 4:
        return 'bg-amber-300 dark:bg-amber-300 light:bg-amber-600 border-amber-200 shadow-[0_0_12px_rgba(252,211,77,0.6)]';
    }
  };

  return (
    <section id="leetcode" className="depth-section py-16 sm:py-20 max-w-6xl mx-auto px-4 sm:px-8 relative">
      <div className="pointer-events-none absolute top-1/4 left-0 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-amber-500/10 blur-[130px] -z-10" />

      {/* Section Header */}
      <div className="gsap-reveal flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8 sm:mb-10">
        <div>
          <div className="flex items-center gap-3 text-xs font-mono tracking-widest uppercase text-amber-500 mb-2">
            <span className="text-neutral-500">(03)</span>
            <span className="w-6 h-px bg-amber-500" />
            <span>Algorithmic Problem Solving</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-normal text-neutral-100 dark:text-neutral-100 light:text-neutral-900 tracking-tight">
            LeetCode <span className="font-serif italic text-amber-500 dark:text-amber-400">contributions.</span>
          </h2>
        </div>

        {/* Live Sync Trigger & Profile Link */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleManualSync}
            onMouseEnter={() => soundEngine.playHover()}
            disabled={isRefreshing}
            aria-label="Refresh LeetCode data from live API"
            className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[40px] text-xs font-mono font-medium rounded-lg border border-neutral-800 dark:border-neutral-800 light:border-stone-300 bg-neutral-900/60 dark:bg-neutral-900/60 light:bg-stone-100 text-neutral-300 dark:text-neutral-300 light:text-neutral-700 hover:border-amber-500/50 hover:text-amber-400 transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-500' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : syncedJustNow ? 'Updated!' : 'Sync Live Data'}</span>
          </button>

          <a
            href="https://leetcode.com/u/sachin8147-star/"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => soundEngine.playHover()}
            onClick={() => soundEngine.playClick()}
            className="inline-flex items-center gap-1.5 py-2 min-h-[40px] text-xs font-mono text-neutral-400 dark:text-neutral-400 light:text-neutral-600 hover:text-amber-400 transition-colors whitespace-nowrap"
          >
            <span>leetcode.com/u/sachin8147-star</span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          </a>
        </div>
      </div>

      {/* Main LeetCode Contribution Card */}
      <div className="gsap-reveal rounded-3xl border border-neutral-800/80 dark:border-neutral-800/80 light:border-stone-200 bg-[#0E1020]/80 dark:bg-[#0E1020]/80 light:bg-stone-50 p-5 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        {/* Compact Top KPI Row + Badge */}
        <div className="gsap-stagger-grid grid grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-6 pb-6 sm:pb-7 border-b border-neutral-800/80 dark:border-neutral-800/80 light:border-stone-200 items-center">
          <div className="gsap-stagger-item">
            <div
              data-testid="leetcode-total-solved"
              className="text-4xl sm:text-5xl font-serif italic text-amber-500 dark:text-amber-400 tabular-nums leading-none"
            >
              {stats.totalSolved}
            </div>
            <div className="text-xs text-neutral-400 dark:text-neutral-400 light:text-neutral-600 mt-1.5 font-mono">
              problems solved · C++
            </div>
          </div>

          <div className="gsap-stagger-item">
            <div className="flex items-center gap-2">
              <span className="text-4xl sm:text-5xl font-serif italic text-neutral-100 dark:text-neutral-100 light:text-neutral-900 tabular-nums leading-none">
                {stats.streak}
              </span>
              <Flame className="w-5 h-5 text-amber-500 shrink-0" />
            </div>
            <div className="text-xs text-neutral-400 dark:text-neutral-400 light:text-neutral-600 mt-1.5 font-mono">
              day active streak
            </div>
          </div>

          <div className="gsap-stagger-item">
            <div className="text-4xl sm:text-5xl font-serif italic text-neutral-100 dark:text-neutral-100 light:text-neutral-900 tabular-nums leading-none">
              {stats.totalActiveDays}
            </div>
            <div className="text-xs text-neutral-400 dark:text-neutral-400 light:text-neutral-600 mt-1.5 font-mono">
              active days (2026)
            </div>
          </div>

          <div className="gsap-stagger-item">
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-2xl font-mono font-bold text-neutral-100 dark:text-neutral-100 light:text-neutral-900 tabular-nums">
                #{formatNumberWithCommas(stats.ranking)}
              </span>
              <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
            </div>
            <div className="text-xs text-neutral-400 dark:text-neutral-400 light:text-neutral-600 mt-1.5 font-mono">
              global ranking
            </div>
          </div>

          {/* 50 Days Badge 2026 */}
          <div className="gsap-stagger-item col-span-2 lg:col-span-1 flex items-center gap-3 p-3 rounded-2xl bg-neutral-950/60 dark:bg-neutral-950/60 light:bg-white border border-neutral-800/80 dark:border-neutral-800/80 light:border-stone-200">
            <Award className="w-8 h-8 text-amber-400 shrink-0" />
            <div className="min-w-0">
              <div className="text-xs font-semibold text-neutral-100 dark:text-neutral-100 light:text-neutral-900 truncate">
                50 Days Badge 2026
              </div>
              <div className="text-[11px] font-mono text-amber-500 truncate">
                Top consistency tier
              </div>
            </div>
          </div>
        </div>

        {/* 52-Week LeetCode Submission Contribution Graph */}
        <div className="gsap-reveal py-6 sm:py-7 border-b border-neutral-800/80 dark:border-neutral-800/80 light:border-stone-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-300 dark:text-neutral-300 light:text-neutral-700">
              <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                <strong className="text-neutral-100 dark:text-neutral-100 light:text-neutral-900 font-bold tabular-nums">
                  {grid.totalContributions}
                </strong>{' '}
                submissions in the past year across{' '}
                <strong className="text-amber-400 font-bold tabular-nums">{stats.totalActiveDays}</strong> active days
              </span>
            </div>

            {/* Interactive Hover Readout */}
            <div className="text-xs font-mono text-neutral-400 dark:text-neutral-400 light:text-neutral-600 min-h-[20px] flex items-center">
              {hoveredDay ? (
                <span className="text-amber-400 font-medium">
                  {hoveredDay.count} {hoveredDay.count === 1 ? 'submission' : 'submissions'} on {hoveredDay.formattedDate}
                </span>
              ) : (
                <span>Hover or tap any square for daily submission telemetry</span>
              )}
            </div>
          </div>

          {/* Heatmap Scroll Container */}
          <div className="overflow-x-auto pb-2 -mx-1 px-1">
            <div className="min-w-[680px] sm:min-w-[720px]">
              {/* Month Labels Row */}
              <div className="flex items-center pl-8 mb-1.5 text-[10px] font-mono text-neutral-400 dark:text-neutral-400 light:text-neutral-600">
                {grid.weeks.map((week) => (
                  <div key={week.weekIndex} className="flex-1 min-w-[12px] text-left">
                    {week.monthLabel || ''}
                  </div>
                ))}
              </div>

              {/* Day-of-Week Labels + 52 Week Columns */}
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
                  aria-label="LeetCode 52-week submission contribution graph"
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
                          onClick={() => setHoveredDay(day)}
                          onMouseLeave={() => setHoveredDay(null)}
                          title={`${day.count} submissions on ${day.formattedDate}`}
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

          {/* Heatmap Legend */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-3 text-[11px] font-mono text-neutral-400 dark:text-neutral-400 light:text-neutral-600">
            <span>Language: C++ (STL, Graph &amp; DP)</span>
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

        {/* Compact 3-Column Difficulty Distribution Strip */}
        <div className="gsap-stagger-grid grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
          {/* Easy */}
          <div className="gsap-stagger-item p-3.5 rounded-xl border border-neutral-800/60 dark:border-neutral-800/60 light:border-stone-200 bg-neutral-950/40 dark:bg-neutral-950/40 light:bg-white">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-emerald-400 font-semibold">Easy</span>
              <span className="text-neutral-300 dark:text-neutral-300 light:text-neutral-700 tabular-nums">
                <strong data-testid="leetcode-easy-solved" className="text-neutral-100 dark:text-neutral-100 light:text-neutral-900 font-bold">
                  {stats.easySolved}
                </strong>{' '}
                / {stats.totalEasy || 975} ({easyPercent}%)
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-neutral-800 dark:bg-neutral-800 light:bg-stone-200 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, (stats.easySolved / 150) * 100)}%` }}
              />
            </div>
          </div>

          {/* Medium */}
          <div className="gsap-stagger-item p-3.5 rounded-xl border border-neutral-800/60 dark:border-neutral-800/60 light:border-stone-200 bg-neutral-950/40 dark:bg-neutral-950/40 light:bg-white">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-amber-400 font-semibold">Medium</span>
              <span className="text-neutral-300 dark:text-neutral-300 light:text-neutral-700 tabular-nums">
                <strong data-testid="leetcode-medium-solved" className="text-neutral-100 dark:text-neutral-100 light:text-neutral-900 font-bold">
                  {stats.mediumSolved}
                </strong>{' '}
                / {stats.totalMedium || 2139} ({medPercent}%)
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-neutral-800 dark:bg-neutral-800 light:bg-stone-200 overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, (stats.mediumSolved / 150) * 100)}%` }}
              />
            </div>
          </div>

          {/* Hard */}
          <div className="gsap-stagger-item p-3.5 rounded-xl border border-neutral-800/60 dark:border-neutral-800/60 light:border-stone-200 bg-neutral-950/40 dark:bg-neutral-950/40 light:bg-white">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-rose-400 font-semibold">Hard</span>
              <span className="text-neutral-300 dark:text-neutral-300 light:text-neutral-700 tabular-nums">
                <strong data-testid="leetcode-hard-solved" className="text-neutral-100 dark:text-neutral-100 light:text-neutral-900 font-bold">
                  {stats.hardSolved}
                </strong>{' '}
                / {stats.totalHard || 987} ({hardPercent}%)
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-neutral-800 dark:bg-neutral-800 light:bg-stone-200 overflow-hidden">
              <div
                className="h-full bg-rose-500 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, (stats.hardSolved / 50) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Live Recent Accepted Solutions Strip */}
        {stats.recentSubmissions && stats.recentSubmissions.length > 0 && (
          <div className="mt-6 pt-5 border-t border-neutral-800/80 dark:border-neutral-800/80 light:border-stone-200">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-400 light:text-neutral-500">
                Recent Accepted Solutions · Live Telemetry
              </span>
              <span className="text-[11px] font-mono text-emerald-400">
                Latest: {stats.recentSubmissions[0].title}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {stats.recentSubmissions.slice(0, 3).map((sub) => {
                const subDate = new Date(Number(sub.timestamp) * 1000).toISOString();
                return (
                  <a
                    key={sub.id}
                    href={`https://leetcode.com/problems/${sub.titleSlug}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => soundEngine.playHover()}
                    onClick={() => soundEngine.playClick()}
                    className="p-3 rounded-xl border border-neutral-800/70 dark:border-neutral-800/70 light:border-stone-200 bg-neutral-950/50 dark:bg-neutral-950/50 light:bg-white hover:border-amber-500/50 transition-colors flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-xs font-medium text-neutral-200 dark:text-neutral-200 light:text-neutral-800 group-hover:text-amber-400 transition-colors truncate">
                        {sub.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500 shrink-0 tabular-nums">
                      {formatRelativeTime(subDate)}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
