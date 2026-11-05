import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Project } from '../types/portfolio';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';
import { TechIcon } from './TechIcons';
import { formatWorksCounter } from '../utils/daikiSceneLogic';
import { soundEngine } from '../utils/soundEngine';
import {
  ArrowRight,
  ArrowUpRight,
  MoveHorizontal,
  ChevronLeft,
  ChevronRight,
  Github,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface FeaturedProjectsProps {
  projects: Project[];
  onViewAllProjects: () => void;
  totalProjectsCount?: number;
}

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({
  projects,
  onViewAllProjects,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  const sectionRef = useRef<HTMLElement | null>(null);
  const railContainerRef = useRef<HTMLDivElement | null>(null);

  const categories = ['All', 'Full-Stack', 'SaaS & Web', 'AI / ML', 'Tools & Systems'];

  // On the main page, show the top 6 featured items
  const mainProjects = projects.slice(0, 6);

  const filteredProjects =
    selectedCategory === 'All'
      ? mainProjects
      : mainProjects.filter((p) => p.category === selectedCategory);

  // Smooth GSAP ScrollTrigger horizontal progress + 3D card entrance
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const container = railContainerRef.current;
    const sec = sectionRef.current;
    if (!container || !sec) return;

    const ctx = gsap.context(() => {
      const cards = container.querySelectorAll('.showcase-work-card');
      gsap.fromTo(
        cards,
        { y: 40, opacity: 0, rotateX: 6, scale: 0.96, transformPerspective: 1200 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          scale: 1,
          duration: 0.75,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sec,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Gentle scroll-linked horizontal advance of the gallery as user scrolls past #projects
      ScrollTrigger.create({
        trigger: sec,
        start: 'top 65%',
        end: 'bottom 25%',
        onUpdate: (self) => {
          if (!railContainerRef.current) return;
          const maxScroll = Math.max(
            0,
            railContainerRef.current.scrollWidth - railContainerRef.current.clientWidth
          );
          if (maxScroll > 0) {
            railContainerRef.current.scrollLeft = self.progress * maxScroll * 0.42;
          }
        },
      });
    }, sec);

    return () => ctx.revert();
  }, [selectedCategory, filteredProjects.length]);

  // Track horizontal scroll position to update the "01 / 06" counter
  const handleRailScroll = () => {
    const container = railContainerRef.current;
    if (!container || filteredProjects.length === 0) return;
    const maxScroll = Math.max(1, container.scrollWidth - container.clientWidth);
    const ratio = container.scrollLeft / maxScroll;
    const idx = Math.min(
      filteredProjects.length - 1,
      Math.max(0, Math.round(ratio * (filteredProjects.length - 1)))
    );
    setActiveIndex(idx);
  };

  // Convert vertical wheel into horizontal scroll when hovering in Daiki Horizontal Showcase
  const handleRailWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const container = railContainerRef.current;
    if (!container) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      const atStart = container.scrollLeft <= 2 && e.deltaY < 0;
      const atEnd = container.scrollLeft >= maxScrollLeft - 2 && e.deltaY > 0;
      if (!atStart && !atEnd) {
        e.preventDefault();
        container.scrollLeft += e.deltaY * 1.15;
      }
    }
  };

  const scrollRailBy = (dir: -1 | 1) => {
    soundEngine.playClick();
    if (!railContainerRef.current) return;
    railContainerRef.current.scrollBy({ left: dir * 680, behavior: 'smooth' });
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="depth-section py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-8 relative border-t border-neutral-800/40 dark:border-neutral-800/40 light:border-stone-300/70"
    >
      {/* Top Sticky-Style Header Row: [03] SELECTED WORKS & 01 / 06 Counter */}
      <div className="flex items-center justify-between gap-4 mb-6 gsap-reveal">
        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-400 light:text-neutral-600">
          [03] SELECTED WORKS
        </span>

        <div className="flex items-center gap-4">
          <span
            data-testid="selected-works-counter"
            className="text-xs font-mono uppercase tracking-[0.22em] font-semibold text-neutral-200 dark:text-neutral-200 light:text-[#141413] tabular-nums"
          >
            {formatWorksCounter(activeIndex, filteredProjects.length)}
          </span>
        </div>
      </div>

      {/* Section Title + Clean Category Filter & See All Projects Button */}
      <div className="gsap-reveal flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl sm:text-5xl font-bold uppercase tracking-[-0.035em] text-neutral-100 dark:text-neutral-100 light:text-[#141413]">
            <span className="hover-word">SELECTED</span>{' '}
            <span className="font-serif italic font-normal lowercase text-amber-500 dark:text-amber-400 light:text-purple-700 hover-word">
              memories
            </span>{' '}
            <span className="hover-word">&amp; WORKS.</span>
          </h2>
          <p className="text-xs font-mono text-neutral-400 dark:text-neutral-400 light:text-neutral-600 mt-1.5">
            Production SaaS platforms, clinical systems, and AI/NLP engines shipped end-to-end.
          </p>
        </div>

        {/* Clean Category Filter Tabs + Minimal See All Projects Button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-neutral-900/60 dark:bg-neutral-900/60 light:bg-stone-200/80 border border-neutral-800 dark:border-neutral-800 light:border-stone-300">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedCategory(cat);
                  setActiveIndex(0);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-neutral-100 dark:bg-neutral-100 light:bg-[#141413] text-neutral-950 dark:text-neutral-950 light:text-white shadow-sm'
                    : 'text-neutral-400 dark:text-neutral-400 light:text-neutral-700 hover:text-neutral-100 light:hover:text-neutral-950'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              soundEngine.playClick();
              onViewAllProjects();
            }}
            onMouseEnter={() => soundEngine.playHover()}
            className="mag inline-flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider font-semibold rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-all whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
          >
            <span>See All Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* =====================================================================
          SINGLE UNIFIED DAIKI FUJITA HORIZONTAL SHOWCASE (00:20 - 00:25 in video)
         ===================================================================== */}
      <div>
        {/* Horizontal Navigation Bar */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono text-neutral-400 dark:text-neutral-400 light:text-neutral-600">
            <MoveHorizontal className="w-4 h-4 text-amber-500 shrink-0" />
            <span>SWIPE OR SCROLL THROUGH SELECTED WORKS →</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => scrollRailBy(-1)}
              aria-label="Previous work"
              className="w-9 h-9 rounded-full border border-neutral-700 dark:border-neutral-700 light:border-stone-300 bg-neutral-900/80 dark:bg-neutral-900/80 light:bg-white flex items-center justify-center text-neutral-200 dark:text-neutral-200 light:text-neutral-800 hover:border-amber-500 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollRailBy(1)}
              aria-label="Next work"
              className="w-9 h-9 rounded-full border border-neutral-700 dark:border-neutral-700 light:border-stone-300 bg-neutral-900/80 dark:bg-neutral-900/80 light:bg-white flex items-center justify-center text-neutral-200 dark:text-neutral-200 light:text-neutral-800 hover:border-amber-500 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Gallery with Daiki Fujita Editorial Title Blocks + Interactive Visual Frame */}
        <div
          ref={railContainerRef}
          onScroll={handleRailScroll}
          onWheel={handleRailWheel}
          className="flex items-stretch gap-5 sm:gap-8 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scroll-smooth"
        >
          {filteredProjects.map((project, idx) => (
            <div
              key={project.id}
              onMouseEnter={() => setActiveIndex(idx)}
              className="showcase-work-card w-[calc(100vw-2.25rem)] sm:w-[680px] md:w-[760px] shrink-0 snap-start rounded-[28px] border border-indigo-500/20 dark:border-indigo-500/20 light:border-stone-300 bg-[#0D0E20]/90 dark:bg-[#0D0E20]/90 light:bg-[#F6F5F0] p-4 sm:p-7 shimmer-card grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-center shadow-xl"
            >
              {/* Left 5 Columns: Daiki Fujita Editorial Title Block */}
              <div className="md:col-span-5 flex flex-col justify-between h-full space-y-4">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-400 light:text-neutral-500 mb-2">
                    {String(idx + 1).padStart(2, '0')} — {project.subtitle}
                  </div>
                  <h3
                    onClick={() => {
                      soundEngine.playClick();
                      setActiveModalProject(project);
                    }}
                    className="text-2xl sm:text-4xl font-bold uppercase tracking-[-0.04em] leading-[0.95] text-neutral-100 dark:text-neutral-100 light:text-[#141413] hover:text-amber-500 transition-colors cursor-pointer mb-4"
                  >
                    {project.title}
                  </h3>

                  <div className="space-y-1.5 text-[11px] font-mono border-t border-b border-neutral-800/70 dark:border-neutral-800/70 light:border-stone-300 py-3 mb-3">
                    <div className="flex justify-between gap-2">
                      <span className="text-neutral-500 uppercase">ROLE</span>
                      <span className="text-neutral-200 dark:text-neutral-200 light:text-neutral-800 text-right truncate">
                        {project.tags.slice(0, 3).join(' / ')}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-neutral-500 uppercase">YEAR</span>
                      <span className="text-neutral-200 dark:text-neutral-200 light:text-neutral-800">
                        2026
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400 dark:text-neutral-400 light:text-neutral-600 leading-relaxed line-clamp-3 mb-3">
                    {project.description}
                  </p>

                  {/* Technology Icon Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    {project.tags.map((tech) => (
                      <span
                        key={`rail-badge-${project.id}-${tech}`}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono border border-neutral-800 dark:border-neutral-800 light:border-stone-300 bg-neutral-950/70 dark:bg-neutral-950/70 light:bg-white text-neutral-200 dark:text-neutral-200 light:text-neutral-800"
                      >
                        <TechIcon name={tech} className="w-3 h-3 shrink-0" />
                        <span>{tech}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Link Row: OPEN THE MEMORY ↗ + GitHub */}
                <div className="flex items-center justify-between pt-2">
                  <a
                    href={project.liveUrl || project.githubUrl || '#projects'}
                    target={project.liveUrl || project.githubUrl ? '_blank' : undefined}
                    rel={project.liveUrl || project.githubUrl ? 'noopener noreferrer' : undefined}
                    onClick={(e) => {
                      soundEngine.playClick();
                      if (!project.liveUrl && !project.githubUrl) {
                        e.preventDefault();
                        setActiveModalProject(project);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.2em] font-semibold text-neutral-100 dark:text-neutral-100 light:text-[#141413] hover:text-amber-500 transition-colors"
                  >
                    <span>OPEN THE MEMORY</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.title} GitHub repository`}
                      className="w-8 h-8 rounded-full border border-neutral-700 dark:border-neutral-700 light:border-stone-300 flex items-center justify-center text-neutral-300 dark:text-neutral-300 light:text-neutral-800 hover:border-amber-500"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Right 7 Columns: Artwork-Only Visual Frame + Floating Circular "OPEN" Button */}
              <div className="md:col-span-7 relative group/showcase">
                <ProjectCard
                  project={project}
                  artworkOnly={true}
                  onOpenModal={(p) => setActiveModalProject(p)}
                />
                {/* Floating Circular Daiki Fujita "OPEN" Button Overlay (visible on mobile touch and desktop hover) */}
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setActiveModalProject(project);
                  }}
                  aria-label={`Inspect ${project.title}`}
                  className="pointer-events-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#ECEAE4]/95 text-[#141413] font-mono text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center shadow-[0_12px_35px_rgba(0,0,0,0.45)] border border-white/60 scale-95 sm:scale-90 opacity-90 sm:opacity-0 sm:group-hover/showcase:opacity-100 sm:group-hover/showcase:scale-100 hover:bg-amber-400 transition-all duration-300 cursor-pointer"
                >
                  OPEN
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal View */}
      <ProjectModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
      />
    </section>
  );
};
