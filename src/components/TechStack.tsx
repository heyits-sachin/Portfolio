import React, { useState, useEffect, useRef } from 'react';
import { TechIcon } from './TechIcons';
import { soundEngine } from '../utils/soundEngine';
import { Cpu, CheckCircle2 } from 'lucide-react';

interface TechItem {
  name: string;
  role: string;
  shippedIn: string;
}

// Row 1: Frontend, Core Languages & Full-Stack Frameworks (matches top row in image_8ff446ef.png)
const ROW_1_TECH: TechItem[] = [
  {
    name: 'HTML5',
    role: 'Semantic Markup & Accessibility',
    shippedIn: 'QuickFolio SaaS, Samvidhan, StudyOS & Portfolio v2',
  },
  {
    name: 'CSS3',
    role: 'Responsive Layouts, Keyframe Motion & Styling',
    shippedIn: 'QuickFolio Live Builder, Samvidhan & Interactive UI',
  },
  {
    name: 'React',
    role: 'Component UI & Interactive SPAs',
    shippedIn: 'CampusCrate Marketplace (Vercel) & 3D Portfolio',
  },
  {
    name: 'TypeScript',
    role: 'Type-Safe Frontend & Full-Stack Architecture',
    shippedIn: 'CampusCrate Marketplace & Modern Web Applications',
  },
  {
    name: 'JavaScript',
    role: 'Client Interactivity & Async Telemetry',
    shippedIn: 'QuickFolio Live Builder, StudyOS Charts, Samvidhan Quiz',
  },
  {
    name: 'Python',
    role: 'Primary Backend & AI Language',
    shippedIn: 'QuickFolio (6,000+ LOC), Indian Path-Lab, Samvidhan, NLP Chatbot',
  },
  {
    name: 'C++',
    role: 'Data Structures & Competitive Programming',
    shippedIn: '133+ LeetCode algorithmic solutions · 51-day streak',
  },
  {
    name: 'Django',
    role: 'Full-Stack Batteries-Included Framework',
    shippedIn: 'Indian Path-Lab, CampusCrate, Samvidhan, StudyOS',
  },
  {
    name: 'Flask',
    role: 'Modular Production Web Framework',
    shippedIn: 'QuickFolio SaaS (75 endpoints, OAuth 2.0, CSP security)',
  },
  {
    name: 'Tailwind CSS',
    role: 'Utility-First Design System',
    shippedIn: 'CampusCrate, Samvidhan & Portfolio Architecture',
  },
];

// Row 2: Databases, Cloud, AI & Data Science (matches bottom row in image_8ff446ef.png: SQLite, Supabase, SQL, OpenAI, Gemini...)
const ROW_2_TECH: TechItem[] = [
  {
    name: 'SQLite',
    role: 'Embedded Relational Schema Engine',
    shippedIn: 'QuickFolio (15 production tables), Samvidhan, StudyOS',
  },
  {
    name: 'Supabase',
    role: 'Cloud Postgres & Real-Time State',
    shippedIn: 'CampusCrate Marketplace & ProofPay Milestone Escrow',
  },
  {
    name: 'SQL',
    role: 'Relational Query Optimization & Indexing',
    shippedIn: 'QuickFolio Analytics, Indian Path-Lab & DBMS Coursework',
  },
  {
    name: 'OpenAI',
    role: 'LLM Prompt Engineering & Intelligent Agents',
    shippedIn: 'AI/NLP Conversational Workflows & Automated Reporting',
  },
  {
    name: 'Gemini API',
    role: 'Generative AI & Civic Intelligence',
    shippedIn: 'Samvidhan Interactive Constitutional Platform & AI Workflows',
  },
  {
    name: 'PostgreSQL',
    role: 'Production Relational Database',
    shippedIn: 'Indian Path-Lab Clinical System, CampusCrate, ProofPay Escrow',
  },
  {
    name: 'Scikit-learn',
    role: 'Machine Learning & Classification',
    shippedIn: 'SMS Spam Classifier (TF-IDF + Naive Bayes · 97.2% accuracy)',
  },
  {
    name: 'NLTK',
    role: 'Natural Language Processing & Stemming',
    shippedIn: 'Python NLP Intent Chatbot & SMS Spam Text Pipeline',
  },
  {
    name: 'Pandas',
    role: 'Tabular Data Wrangling & KPI Aggregation',
    shippedIn: 'Automated CSV-to-PDF Sales Report Generator & Data Mining',
  },
  {
    name: 'Git',
    role: 'Distributed Version Control & CI/CD',
    shippedIn: '29+ public GitHub repositories & collaborative builds',
  },
];

interface TechStackProps {
  totalSolved?: number;
}

export const TechStack: React.FC<TechStackProps> = ({ totalSolved = 133 }) => {
  const row1WithLiveCount = ROW_1_TECH.map((item) =>
    item.name === 'C++'
      ? { ...item, shippedIn: `${totalSolved}+ LeetCode algorithmic solutions · 51-day streak` }
      : item
  );
  const [selectedTech, setSelectedTech] = useState<TechItem>(row1WithLiveCount[5]); // Default spotlight: Python
  const row1Ref = useRef<HTMLDivElement | null>(null);
  const row2Ref = useRef<HTMLDivElement | null>(null);
  const pausedRef = useRef<boolean>(false);

  // Duplicate arrays 3x for seamless infinite coming-and-going stream
  const row1Loop = [...row1WithLiveCount, ...row1WithLiveCount, ...row1WithLiveCount];
  const row2Loop = [...ROW_2_TECH, ...ROW_2_TECH, ...ROW_2_TECH];

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let offset1 = 0;
    let offset2 = -33.333;

    const timer = window.setInterval(() => {
      if (pausedRef.current) return;
      offset1 -= 0.085;
      if (offset1 <= -33.333) offset1 = 0;

      offset2 += 0.085;
      if (offset2 >= 0) offset2 = -33.333;

      if (row1Ref.current) {
        row1Ref.current.style.transform = `translate3d(${offset1.toFixed(3)}%, 0, 0)`;
      }
      if (row2Ref.current) {
        row2Ref.current.style.transform = `translate3d(${offset2.toFixed(3)}%, 0, 0)`;
      }
    }, 75);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="stack" className="depth-section py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-8 relative">
      {/* =====================================================================
          EDITORIAL HEADER (Matches user's reference screenshot image_8ff446ef.png)
          - Kicker: ARSENAL & TOOLS
          - Heading: italic Serif "Tech" + Sans "Stack"
          - Full-width subtle horizontal rule
          - Subtitle paragraph
         ===================================================================== */}
      <div className="gsap-reveal mb-12">
        <div className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400 dark:text-neutral-400 light:text-neutral-500 mb-3">
          ARSENAL &amp; TOOLS
        </div>

        <h2 className="text-4xl sm:text-6xl tracking-tight leading-none mb-7 flex items-baseline gap-3">
          <span className="hover-word font-serif italic font-normal text-neutral-100 dark:text-white light:text-[#141413]">
            Tech
          </span>
          <span className="hover-word font-sans font-normal text-neutral-500 dark:text-neutral-500 light:text-neutral-500">
            Stack
          </span>
        </h2>

        {/* Full-width hairline divider */}
        <div className="w-full h-px bg-neutral-800/90 dark:bg-neutral-800/90 light:border-t light:border-stone-300 mb-7" />

        <p className="text-base sm:text-lg text-neutral-400 dark:text-neutral-400 light:text-neutral-600 max-w-xl leading-relaxed font-normal">
          I leverage a modern ecosystem of tools and frameworks to build high-performance,
          accessible, and scalable digital products.
        </p>
      </div>

      {/* =====================================================================
          ATMOSPHERIC DARK RIDGE / NEBULA STAGE WITH TWO FLOATING ICON STREAMS
          ("make tech stack like this coming and going")
         ===================================================================== */}
      <div
        onMouseEnter={() => {
          pausedRef.current = true;
        }}
        onMouseLeave={() => {
          pausedRef.current = false;
        }}
        className="gsap-reveal relative rounded-[32px] overflow-hidden py-14 sm:py-20 border border-neutral-800/70 dark:border-neutral-800/70 light:border-stone-300/90 bg-gradient-to-b from-[#17171B] via-[#101014] to-[#09090C] shadow-[0_30px_80px_rgba(0,0,0,0.55)] select-none"
      >
        {/* Subtle Warm Amber & Deep Indigo Mountain Peak / Nebula Glow in Center */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(420px 260px at 48% 54%, rgba(217, 119, 6, 0.16), rgba(88, 28, 135, 0.12) 48%, transparent 75%)',
          }}
        />

        {/* Subtle Dark Mountain Ridge Silhouette SVG (matching background of image_8ff446ef.png) */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1200 420"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 w-full h-full opacity-55"
        >
          <defs>
            <linearGradient id="ridge-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#26262C" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#070709" stopOpacity="0.98" />
            </linearGradient>
          </defs>
          <path
            d="M0,320 Q180,280 310,220 L435,95 L575,235 Q760,310 960,260 L1200,310 L1200,420 L0,420 Z"
            fill="url(#ridge-grad)"
          />
        </svg>

        {/* Left & Right Soft Edge Vignette Masks so icons smoothly emerge & vanish */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-40 z-20 bg-gradient-to-r from-[#0D0D10] via-[#0D0D10]/80 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-40 z-20 bg-gradient-to-l from-[#0D0D10] via-[#0D0D10]/80 to-transparent"
        />

        {/* ROW 1: Gliding Left ← (HTML5, CSS3, React, TypeScript, JS, Python, C++, Django, Flask...) */}
        <div className="relative z-10 overflow-hidden py-4 mb-8 sm:mb-12">
          <div
            ref={row1Ref}
            className="flex items-center gap-14 sm:gap-24 w-max px-8 will-change-transform"
          >
            {row1Loop.map((item, idx) => {
              const isSelected = selectedTech.name === item.name;
              return (
                <button
                  key={`r1-${item.name}-${idx}`}
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setSelectedTech(item);
                  }}
                  onMouseEnter={() => {
                    soundEngine.playHover();
                    setSelectedTech(item);
                  }}
                  aria-label={`Inspect ${item.name}`}
                  className="group relative flex flex-col items-center justify-center cursor-pointer focus:outline-none transition-transform duration-300 hover:scale-125"
                >
                  {/* Floating Tooltip on Hover */}
                  <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-white text-neutral-950 text-[11px] font-sans font-bold whitespace-nowrap opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 shadow-lg z-30">
                    {item.name}
                  </span>

                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center transition-all duration-300 ${
                      isSelected ? 'scale-110' : 'opacity-90 group-hover:opacity-100'
                    }`}
                  >
                    <TechIcon
                      name={item.name}
                      className="w-12 h-12 sm:w-14 sm:h-14 text-white"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ROW 2: Gliding Right → (SQLite, Supabase, SQL, OpenAI, Gemini, PostgreSQL, Scikit-learn, NLTK...) */}
        <div className="relative z-10 overflow-hidden py-4">
          <div
            ref={row2Ref}
            className="flex items-center gap-14 sm:gap-24 w-max px-8 will-change-transform"
          >
            {row2Loop.map((item, idx) => {
              const isSelected = selectedTech.name === item.name;
              return (
                <button
                  key={`r2-${item.name}-${idx}`}
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setSelectedTech(item);
                  }}
                  onMouseEnter={() => {
                    soundEngine.playHover();
                    setSelectedTech(item);
                  }}
                  aria-label={`Inspect ${item.name}`}
                  className="group relative flex flex-col items-center justify-center cursor-pointer focus:outline-none transition-transform duration-300 hover:scale-125"
                >
                  {/* Floating Tooltip on Hover */}
                  <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-white text-neutral-950 text-[11px] font-sans font-bold whitespace-nowrap opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 shadow-lg z-30">
                    {item.name}
                  </span>

                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center transition-all duration-300 ${
                      isSelected ? 'scale-110' : 'opacity-90 group-hover:opacity-100'
                    }`}
                  >
                    <TechIcon
                      name={item.name}
                      className={
                        item.name === 'Gemini API'
                          ? 'w-20 h-12 sm:w-24 sm:h-14 text-white'
                          : 'w-12 h-12 sm:w-14 sm:h-14 text-white'
                      }
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Production Spotlight Bar Below the Stage */}
      <div className="gsap-reveal mt-6 p-5 sm:p-6 rounded-2xl border border-neutral-800/80 dark:border-neutral-800/80 light:border-stone-300 bg-[#0D0E1D]/90 dark:bg-[#0D0E1D]/90 light:bg-[#F7F6F1] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shimmer-card">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-center shrink-0 shadow-md text-white">
            <TechIcon name={selectedTech.name} className="w-7 h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-base sm:text-lg font-bold text-neutral-100 dark:text-neutral-100 light:text-neutral-900">
                {selectedTech.name}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30">
                {selectedTech.role}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 dark:text-neutral-300 light:text-neutral-700 mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>
                <strong className="font-mono text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-400 light:text-neutral-500">
                  Shipped in:
                </strong>{' '}
                {selectedTech.shippedIn}
              </span>
            </p>
          </div>
        </div>

        <div className="text-[11px] font-mono text-amber-500 flex items-center gap-1.5 shrink-0">
          <Cpu className="w-3.5 h-3.5" />
          <span>Hover any icon above to inspect</span>
        </div>
      </div>
    </section>
  );
};

