import React, { useRef, useState } from 'react';
import { ArrowUpRight, Github, Bot, ShieldCheck, FileSpreadsheet, CloudSun, Database, BrainCircuit, Scale, Landmark } from 'lucide-react';
import { Project } from '../types/portfolio';
import { TechIcon } from './TechIcons';
import { soundEngine } from '../utils/soundEngine';

interface ProjectCardProps {
  project: Project;
  onOpenModal: (project: Project) => void;
  artworkOnly?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onOpenModal,
  artworkOnly = false,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState('');
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, opacity: 0 });
  const [imgError, setImgError] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = x / rect.width;
    const py = y / rect.height;

    const rotX = (0.5 - py) * 5;
    const rotY = (px - 0.5) * 5;
    setTransform(`perspective(1100px) rotateX(${rotX}deg) rotateY(${rotY}deg)`);
    setSpotlight({ x: px * 100, y: py * 100, opacity: 0.16 });
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1100px) rotateX(0deg) rotateY(0deg)');
    setSpotlight((prev) => ({ ...prev, opacity: 0 }));
  };

  // Bespoke visual previews with suitable icons/illustrations for projects without screenshots
  const renderCustomVisual = () => {
    const id = project.id.toLowerCase();
    const titleNorm = project.title.toLowerCase();

    // 1. Samvidhan (Indian Constitution Platform - matches user's attached screenshot)
    if (id.includes('samvidhan') || titleNorm.includes('samvidhan')) {
      return (
        <div className="w-full h-full bg-gradient-to-b from-[#071A3E] via-[#0B2558] to-[#06132E] text-white flex flex-col items-center justify-center p-5 text-center relative overflow-hidden select-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(245,158,11,0.18),transparent_65%)]" />
          <div className="relative z-10 flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.25em] text-amber-300/90 mb-1">
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>WE, THE PEOPLE</span>
          </div>
          <div className="relative z-10 font-serif font-bold text-2xl sm:text-3xl text-amber-400 tracking-tight leading-none mb-2 drop-shadow-[0_2px_10px_rgba(245,158,11,0.3)]">
            of India
          </div>
          <p className="relative z-10 text-[10px] text-blue-100/80 max-w-xs leading-relaxed italic mb-3">
            "...solemnly resolve to constitute India into a Sovereign, Socialist, Secular, Democratic Republic and to secure to all its citizens: Justice, Liberty, Equality and Fraternity."
          </p>
          <div className="relative z-10 text-[8px] font-mono uppercase tracking-widest text-amber-300/70 mb-3">
            — PREAMBLE TO THE CONSTITUTION OF INDIA
          </div>
          <div className="relative z-10 flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-amber-500 text-neutral-950 font-sans font-bold text-[10px] shadow-md">
              Explore Values
            </span>
            <span className="px-3 py-1 rounded-full border border-blue-300/40 bg-blue-950/50 text-blue-100 font-sans font-medium text-[10px]">
              View Timeline
            </span>
          </div>
        </div>
      );
    }

    // 2. Python NLP Chatbot (Glowing Robot Icon & Conversational AI UI as requested by user)
    if (id.includes('chatbot') || titleNorm.includes('chatbot')) {
      return (
        <div className="w-full h-full bg-gradient-to-br from-[#0D0B1E] via-[#151136] to-[#090814] text-white p-5 flex items-center justify-between gap-4 relative overflow-hidden select-none">
          <div className="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-purple-500/20 blur-2xl" />
          <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full bg-cyan-500/20 blur-2xl" />

          {/* Glowing Robot Avatar & Status */}
          <div className="relative z-10 flex flex-col items-center justify-center shrink-0 pl-2">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600/40 via-purple-500/30 to-cyan-400/30 border border-purple-400/40 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.35)] relative">
              <Bot className="w-11 h-11 text-cyan-300 drop-shadow-[0_0_8px_rgba(103,232,249,0.8)]" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 ring-4 ring-[#0D0B1E]" />
            </div>
            <span className="mt-2 text-[10px] font-mono uppercase tracking-widest text-purple-300">
              NLTK Engine v2
            </span>
          </div>

          {/* Simulated NLP Conversation Bubbles */}
          <div className="relative z-10 flex-1 space-y-2 font-sans text-left max-w-[230px]">
            <div className="px-3 py-1.5 rounded-2xl rounded-tl-sm bg-white/10 border border-white/10 text-[11px] text-neutral-200">
              How does intent classification work?
            </div>
            <div className="px-3 py-2 rounded-2xl rounded-tr-sm bg-gradient-to-r from-indigo-600/80 to-purple-600/80 border border-purple-400/30 text-[11px] text-white shadow-lg">
              <div className="flex items-center gap-1.5 text-[9px] font-mono text-cyan-200 mb-0.5">
                <span>✓ Tokenized · Porter Stemmer · 98% Match</span>
              </div>
              I tokenize input queries with NLTK and map stems to trained intent patterns!
            </div>
          </div>
        </div>
      );
    }

    // 3. SMS Spam Classifier (NLP Shield & Probability Matrix)
    if (id.includes('spam') || titleNorm.includes('spam')) {
      return (
        <div className="w-full h-full bg-gradient-to-br from-[#09151B] via-[#0F242D] to-[#081016] text-white p-5 flex items-center justify-between gap-4 relative overflow-hidden select-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.18),transparent_60%)]" />
          <div className="relative z-10 flex flex-col items-center shrink-0 pl-2">
            <div className="w-20 h-20 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.25)]">
              <ShieldCheck className="w-11 h-11 text-emerald-400" />
            </div>
            <span className="mt-2 text-[10px] font-mono text-emerald-300 uppercase tracking-widest">
              97.2% Accuracy
            </span>
          </div>
          <div className="relative z-10 flex-1 space-y-2 text-left font-mono">
            <div className="text-[10px] uppercase tracking-wider text-emerald-400">
              TF-IDF + Multinomial Naive Bayes
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-500/25 space-y-1.5 text-[10px]">
              <div className="flex justify-between text-neutral-300">
                <span>Corpus Size:</span>
                <span className="text-white font-bold">5,572 SMS</span>
              </div>
              <div className="flex justify-between text-neutral-300">
                <span>Precision:</span>
                <span className="text-emerald-400 font-bold">99.1% (Ham)</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                <div className="w-[97%] h-full bg-gradient-to-r from-emerald-500 to-cyan-400" />
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 4. Sales Report Generator (CSV to PDF Executive Pipeline)
    if (id.includes('sales') || titleNorm.includes('sales')) {
      return (
        <div className="w-full h-full bg-gradient-to-br from-[#1A120B] via-[#261A10] to-[#0F0B07] text-white p-5 flex items-center justify-between gap-4 relative overflow-hidden select-none">
          <div className="relative z-10 flex flex-col items-center shrink-0 pl-2">
            <div className="w-20 h-20 rounded-2xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.25)]">
              <FileSpreadsheet className="w-11 h-11 text-amber-400" />
            </div>
            <span className="mt-2 text-[10px] font-mono text-amber-300 uppercase tracking-widest">
              CSV → FPDF
            </span>
          </div>
          <div className="relative z-10 flex-1 space-y-2 text-left font-mono">
            <div className="text-xs font-bold text-amber-200">Executive PDF Pipeline</div>
            <div className="flex items-end gap-1.5 h-12 pt-2">
              <div className="w-4 h-6 bg-amber-500/50 rounded-t" />
              <div className="w-4 h-9 bg-amber-500/70 rounded-t" />
              <div className="w-4 h-11 bg-amber-400 rounded-t" />
              <div className="w-4 h-8 bg-indigo-400 rounded-t" />
              <div className="w-4 h-12 bg-emerald-400 rounded-t" />
            </div>
            <div className="text-[10px] text-neutral-400">Automated KPI &amp; Revenue Ledgers</div>
          </div>
        </div>
      );
    }

    // 5. Weather Forecast (OpenWeather API Telemetry)
    if (id.includes('weather') || titleNorm.includes('weather')) {
      return (
        <div className="w-full h-full bg-gradient-to-br from-[#081826] via-[#0C2940] to-[#061019] text-white p-5 flex items-center justify-between gap-4 relative overflow-hidden select-none">
          <div className="relative z-10 flex flex-col items-center shrink-0 pl-2">
            <div className="w-20 h-20 rounded-2xl bg-sky-500/15 border border-sky-400/40 flex items-center justify-center shadow-[0_0_30px_rgba(56,189,248,0.25)]">
              <CloudSun className="w-11 h-11 text-sky-300" />
            </div>
            <span className="mt-2 text-[10px] font-mono text-sky-300 uppercase tracking-widest">
              OpenWeather
            </span>
          </div>
          <div className="relative z-10 flex-1 space-y-1.5 text-left font-mono">
            <div className="text-2xl font-bold text-white">28°C · New Delhi</div>
            <div className="text-[10px] text-sky-300">Humidity: 54% · Wind: 12 km/h NW</div>
            <div className="text-[10px] text-neutral-400">Live REST Telemetry &amp; CLI Forecast</div>
          </div>
        </div>
      );
    }

    // 6. Data Mining / AI Practicals / Scheme Sathi fallback with rich domain icons
    const isAI = id.includes('ai') || titleNorm.includes('ai') || titleNorm.includes('prolog');
    const isScheme = id.includes('sheme') || id.includes('scheme') || titleNorm.includes('sheme');

    return (
      <div className="w-full h-full bg-gradient-to-br from-[#0F0C24] via-[#19143A] to-[#090814] text-white p-5 flex items-center justify-between gap-4 relative overflow-hidden select-none">
        <div className="relative z-10 flex flex-col items-center shrink-0 pl-2">
          <div className="w-20 h-20 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.3)]">
            {isScheme ? (
              <Landmark className="w-11 h-11 text-amber-300" />
            ) : isAI ? (
              <BrainCircuit className="w-11 h-11 text-pink-400" />
            ) : (
              <Database className="w-11 h-11 text-indigo-300" />
            )}
          </div>
          <span className="mt-2 text-[10px] font-mono text-indigo-300 uppercase tracking-widest">
            {project.category}
          </span>
        </div>
        <div className="relative z-10 flex-1 space-y-1.5 text-left">
          <div className="text-sm font-serif italic text-amber-300">{project.subtitle}</div>
          <div className="text-base font-bold text-white leading-snug">{project.title}</div>
          <div className="text-[11px] font-mono text-neutral-400">
            {project.tags.slice(0, 3).join(' · ')}
          </div>
        </div>
      </div>
    );
  };

  const getThematicBadge = () => {
    const id = project.id.toLowerCase();
    const titleNorm = project.title.toLowerCase();
    if (id.includes('chatbot') || titleNorm.includes('chatbot') || titleNorm.includes('nlp')) {
      return { icon: Bot, label: 'AI / NLP Robot', color: 'text-cyan-300 border-purple-400/40 bg-purple-950/70' };
    }
    if (id.includes('spam') || titleNorm.includes('spam')) {
      return { icon: ShieldCheck, label: 'ML Classifier', color: 'text-emerald-300 border-emerald-400/40 bg-emerald-950/70' };
    }
    if (id.includes('sales') || titleNorm.includes('sales')) {
      return { icon: FileSpreadsheet, label: 'PDF Pipeline', color: 'text-amber-300 border-amber-400/40 bg-amber-950/70' };
    }
    if (id.includes('weather') || titleNorm.includes('weather')) {
      return { icon: CloudSun, label: 'Live Telemetry', color: 'text-sky-300 border-sky-400/40 bg-sky-950/70' };
    }
    if (id.includes('samvidhan') || titleNorm.includes('samvidhan')) {
      return { icon: Scale, label: 'Civic Platform', color: 'text-amber-300 border-amber-400/40 bg-blue-950/80' };
    }
    if (id.includes('ai') || titleNorm.includes('ai') || titleNorm.includes('prolog')) {
      return { icon: BrainCircuit, label: 'AI & Logic', color: 'text-pink-300 border-pink-400/40 bg-purple-950/70' };
    }
    return { icon: Database, label: project.category, color: 'text-indigo-200 border-indigo-400/30 bg-indigo-950/70' };
  };

  const thematicBadge = getThematicBadge();
  const ThematicIcon = thematicBadge.icon;

  return (
    <article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => soundEngine.playHover()}
      style={{ transform, transition: 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)' }}
      className={`shimmer-card relative rounded-[28px] border border-indigo-500/20 dark:border-indigo-500/20 light:border-stone-300/90 bg-[#0D0E20]/90 dark:bg-[#0D0E20]/90 light:bg-[#F7F6F1] ${
        artworkOnly ? 'p-3 sm:p-4' : 'gsap-reveal p-5 sm:p-6'
      } flex flex-col group hover:border-purple-400/50 dark:hover:border-purple-400/50 light:hover:border-purple-500/50 transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.35)] light:shadow-[0_16px_40px_rgba(20,20,19,0.07)]`}
    >
      {/* Dynamic Cursor Iridescent Spotlight Effect (Daiki Fujita style) */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[28px] z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(480px circle at ${spotlight.x}% ${spotlight.y}%, rgba(168, 85, 247, ${spotlight.opacity}), rgba(245, 158, 11, ${spotlight.opacity * 0.5}) 45%, transparent 72%)`,
        }}
      />

      {/* Top Rounded Visual Frame */}
      <div
        onClick={() => {
          soundEngine.playClick();
          onOpenModal(project);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpenModal(project);
          }
        }}
        aria-label={`Open ${project.title} preview details`}
        className={`shimmer-card relative z-10 aspect-[16/10] w-full rounded-[20px] bg-[#07070F] dark:bg-[#07070F] light:bg-stone-900 p-2.5 sm:p-3 border border-neutral-800/90 dark:border-neutral-800/90 light:border-stone-300 overflow-hidden cursor-pointer ${
          artworkOnly ? 'mb-0' : 'mb-5'
        } group/frame`}
      >
        {/* Thematic Domain / Robot Icon Badge in Top-Right of Preview Frame */}
        <div
          className={`absolute top-5 right-5 z-20 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono uppercase tracking-wider shadow-lg ${thematicBadge.color}`}
        >
          <ThematicIcon className="w-3.5 h-3.5 shrink-0" />
          <span>{thematicBadge.label}</span>
        </div>

        <div className="w-full h-full rounded-[13px] overflow-hidden relative bg-neutral-950 shadow-inner">
          {project.imageUrl && !imgError ? (
            <img
              src={project.imageUrl}
              alt={`${project.title} preview`}
              loading="lazy"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-top transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1) group-hover/frame:scale-[1.04]"
            />
          ) : (
            renderCustomVisual()
          )}
        </div>
      </div>

      {!artworkOnly && (
        <div className="relative z-10 flex flex-col flex-1 px-1">
          <div className="flex items-start justify-between gap-4 mb-2.5">
            <div>
              <h3
                onClick={() => {
                  soundEngine.playClick();
                  onOpenModal(project);
                }}
                className="text-3xl sm:text-4xl font-serif italic font-normal tracking-tight text-neutral-100 dark:text-neutral-100 light:text-neutral-900 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors cursor-pointer leading-none"
              >
                {project.title}
              </h3>
              <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-400 light:text-neutral-500 mt-2">
                {project.subtitle}
              </p>
            </div>

            {/* Right Action Circles: Outlined GitHub Circle + High-Contrast Launch Circle */}
            <div className="flex items-center gap-2 shrink-0">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundEngine.playClick()}
                  onMouseEnter={() => soundEngine.playHover()}
                  aria-label={`View ${project.title} source on GitHub`}
                  className="w-10 h-10 rounded-full border border-neutral-700/80 dark:border-neutral-700/80 light:border-stone-300 bg-neutral-900/60 dark:bg-neutral-900/60 light:bg-stone-200/80 flex items-center justify-center text-neutral-300 dark:text-neutral-300 light:text-neutral-800 hover:text-amber-400 hover:border-amber-500/60 hover:scale-105 transition-all duration-200"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}

              <a
                href={project.liveUrl || project.githubUrl || '#projects'}
                target={project.liveUrl || project.githubUrl ? '_blank' : undefined}
                rel={project.liveUrl || project.githubUrl ? 'noopener noreferrer' : undefined}
                onClick={(e) => {
                  soundEngine.playClick();
                  if (!project.liveUrl && !project.githubUrl) {
                    e.preventDefault();
                    onOpenModal(project);
                  }
                }}
                onMouseEnter={() => soundEngine.playHover()}
                aria-label={`Open ${project.title}`}
                className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-white light:bg-neutral-900 text-neutral-950 dark:text-neutral-950 light:text-white flex items-center justify-center hover:scale-105 hover:bg-amber-500 dark:hover:bg-amber-400 light:hover:bg-amber-500 light:hover:text-neutral-950 transition-all duration-200 shadow-md"
              >
                <ArrowUpRight className="w-5 h-5 stroke-[2.2]" />
              </a>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-neutral-400 dark:text-neutral-400 light:text-neutral-600 leading-relaxed mb-4 line-clamp-2">
            {project.description}
          </p>

          {/* Technology Icon Badges Strip */}
          <div className="flex flex-wrap items-center gap-1.5 mb-5" aria-label={`${project.title} technology badges`}>
            {project.tags.map((tech) => (
              <span
                key={`badge-${tech}`}
                onMouseEnter={() => soundEngine.playHover()}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium border border-neutral-800 dark:border-neutral-800 light:border-stone-300/90 bg-neutral-950/70 dark:bg-neutral-950/70 light:bg-white text-neutral-200 dark:text-neutral-200 light:text-neutral-800 hover:border-purple-400/60 transition-colors"
              >
                <TechIcon name={tech} className="w-3.5 h-3.5 shrink-0" />
                <span>{tech}</span>
              </span>
            ))}
          </div>

          {/* Bottom Overlapping Circular Tech Icons with Pop-Up White Tooltip on Hover + Deep Dive */}
          <div className="mt-auto pt-3 border-t border-neutral-800/60 dark:border-neutral-800/60 light:border-stone-200/90 flex items-center justify-between">
            <div className="flex items-center pl-1">
              {project.tags.map((tech, idx) => (
                <div
                  key={tech}
                  onMouseEnter={() => soundEngine.playHover()}
                  style={{ zIndex: 10 + idx }}
                  className="group/tech relative -ml-2 first:ml-0 w-9 h-9 rounded-full bg-[#171726] dark:bg-[#171726] light:bg-white border border-neutral-700/80 dark:border-neutral-700/80 light:border-stone-300 flex items-center justify-center hover:z-40 hover:scale-115 hover:mx-1.5 hover:border-amber-400 transition-all duration-200 cursor-pointer shadow-md"
                >
                  {/* White Pop-Up Tooltip Bubble with Pointer Triangle */}
                  <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg bg-neutral-900 dark:bg-white light:bg-neutral-900 text-white dark:text-neutral-950 light:text-white text-xs font-sans font-bold whitespace-nowrap opacity-0 scale-90 translate-y-1 group-hover/tech:opacity-100 group-hover/tech:scale-100 group-hover/tech:translate-y-0 transition-all duration-150 shadow-xl z-50">
                    {tech}
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-neutral-900 dark:bg-white light:bg-neutral-900 rotate-45" />
                  </div>

                  <TechIcon name={tech} className="w-4 h-4" />
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenModal(project);
              }}
              className="text-[11px] font-mono text-neutral-400 dark:text-neutral-400 light:text-neutral-600 hover:text-amber-500 dark:hover:text-amber-400 transition-colors underline underline-offset-4 cursor-pointer"
            >
              Deep dive →
            </button>
          </div>
        </div>
      )}
    </article>
  );
};
