import React from 'react';
import { Award, GraduationCap, School, BookOpen, CheckCircle2, Code2, ExternalLink } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export const EducationSection: React.FC = () => {
  const coursework = [
    { code: 'CS-101', name: 'Object-Oriented Programming in C++' },
    { code: 'CS-201', name: 'Data Structures & Algorithms' },
    { code: 'CS-204', name: 'Database Management Systems (SQL)' },
    { code: 'CS-301', name: 'Artificial Intelligence & Prolog' },
    { code: 'CS-305', name: 'Data Mining (K-Means & Apriori)' },
    { code: 'MA-102', name: 'Discrete Mathematics & Probability' },
  ];

  const honors = [
    {
      title: 'Letter of Recommendation (LOR)',
      org: 'Cyber Defence Zone · Python & ML Internship',
      detail: 'Awarded for shipping 4 production Python applications including a 97.2% accuracy NLP Spam Classifier.',
      badge: 'Verified Credential',
    },
    {
      title: 'Full Stack Developer — SPIE ANDC',
      org: 'International Society for Optics & Photonics (DU Chapter)',
      detail: 'Leading full-stack web engineering for international undergraduate research symposiums and member portals.',
      badge: 'Chapter Leadership',
    },
    {
      title: 'Hackathons & National Initiatives',
      org: 'HackIndia (Commit404) · HeLa Crossroads · Viksit Bharat',
      detail: 'Built ProofPay milestone escrow platform and Scheme Sathi civic-tech discovery portal.',
      badge: 'Civic & Web3',
    },
  ];

  return (
    <section id="edu" className="depth-section py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-8 relative">
      <div className="pointer-events-none absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-amber-500/8 blur-[130px] -z-10" />

      <div className="mb-12 gsap-reveal flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 text-xs font-mono tracking-widest uppercase text-amber-500 mb-2">
            <span className="text-neutral-500">(06)</span>
            <span className="w-6 h-px bg-amber-500" />
            <span>Academic Foundation &amp; Honors</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-normal text-neutral-100 dark:text-neutral-100 light:text-neutral-900 tracking-tight">
            Learning, <span className="font-serif italic text-amber-500 dark:text-amber-400">formally.</span>
          </h2>
        </div>
        <p className="text-xs font-mono text-neutral-400 dark:text-neutral-400 light:text-neutral-600 max-w-md">
          Combining rigorous computer science theory at the University of Delhi with applied software engineering.
        </p>
      </div>

      {/* Asymmetric Academic Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Left 7 Cols: University of Delhi B.Sc. (Hons) CS */}
        <div
          onMouseEnter={() => soundEngine.playHover()}
          className="gsap-reveal lg:col-span-7 p-6 sm:p-8 rounded-3xl border border-indigo-500/20 dark:border-indigo-500/20 light:border-stone-300/90 bg-[#0D0E20]/85 dark:bg-[#0D0E20]/85 light:bg-[#F7F6F1] shimmer-card hover-lift flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.3)] light:shadow-[0_14px_35px_rgba(20,20,19,0.06)]"
        >
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-5 mb-6 border-b border-neutral-800/80 dark:border-neutral-800/80 light:border-stone-200">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-500 text-xs font-mono font-semibold">
                <GraduationCap className="w-4 h-4" />
                <span>2025 — 2028 · Honours Degree</span>
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-400 light:text-neutral-600">
                New Delhi, India
              </span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-serif italic font-normal text-neutral-100 dark:text-neutral-100 light:text-neutral-900 mb-2">
              B.Sc. (Hons) Computer Science
            </h3>
            <p className="text-sm sm:text-base font-semibold text-amber-500 dark:text-amber-400 mb-4">
              Acharya Narendra Dev College · University of Delhi
            </p>
            <p className="text-sm text-neutral-300 dark:text-neutral-300 light:text-neutral-700 leading-relaxed mb-6">
              Pursuing an undergraduate honours curriculum focused on algorithmic analysis, object-oriented systems in C++, relational database theory, artificial intelligence in Prolog/Python, and statistical data mining.
            </p>

            {/* Core Coursework & Practicals Matrix */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-400 light:text-neutral-500 mb-3">
                <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                <span>Core Coursework &amp; Lab Practicals</span>
              </div>
              <div className="gsap-stagger-grid grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {coursework.map((course) => (
                  <div
                    key={course.code}
                    className="gsap-stagger-item flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-neutral-800/90 dark:border-neutral-800/90 light:border-stone-300/90 bg-neutral-950/60 dark:bg-neutral-950/60 light:bg-white text-xs"
                  >
                    <span className="font-mono text-[10px] font-bold text-amber-500 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 shrink-0">
                      {course.code}
                    </span>
                    <span className="text-neutral-200 dark:text-neutral-200 light:text-neutral-800 font-medium truncate">
                      {course.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Link to GitHub Academic Practicals */}
          <div className="pt-4 border-t border-neutral-800/70 dark:border-neutral-800/70 light:border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <span className="text-neutral-400 dark:text-neutral-400 light:text-neutral-600 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-amber-500" />
              <span>All lab implementations open-sourced on GitHub</span>
            </span>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/heyits-sachin/Data-Mining-DM-Practicals"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-500 hover:underline inline-flex items-center gap-1"
              >
                <span>Data Mining Repo</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://github.com/heyits-sachin/AI-Practicals"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-500 hover:underline inline-flex items-center gap-1"
              >
                <span>AI &amp; Prolog Repo</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Honors, Credentials & Class XII */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Honors & Credentials Card */}
          <div
            onMouseEnter={() => soundEngine.playHover()}
            className="gsap-reveal p-6 sm:p-7 rounded-3xl border border-indigo-500/20 dark:border-indigo-500/20 light:border-stone-300/90 bg-[#0D0E20]/85 dark:bg-[#0D0E20]/85 light:bg-[#F7F6F1] shimmer-card hover-lift flex-1"
          >
            <div className="flex items-center justify-between text-xs font-mono text-amber-500 mb-5 pb-3 border-b border-neutral-800/80 dark:border-neutral-800/80 light:border-stone-200">
              <span className="uppercase tracking-widest font-bold">Honors &amp; Recognition</span>
              <Award className="w-4 h-4" />
            </div>

            <div className="gsap-stagger-grid space-y-4">
              {honors.map((item) => (
                <div
                  key={item.title}
                  className="gsap-stagger-item p-4 rounded-2xl border border-neutral-800/80 dark:border-neutral-800/80 light:border-stone-300/80 bg-neutral-950/60 dark:bg-neutral-950/60 light:bg-white"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-sm font-bold text-neutral-100 dark:text-neutral-100 light:text-neutral-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{item.title}</span>
                    </h4>
                  </div>
                  <div className="text-[11px] font-mono text-amber-500 dark:text-amber-400 mb-1.5">
                    {item.org}
                  </div>
                  <p className="text-xs text-neutral-400 dark:text-neutral-400 light:text-neutral-600 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Senior Secondary Card */}
          <div
            onMouseEnter={() => soundEngine.playHover()}
            className="gsap-reveal p-6 rounded-3xl border border-indigo-500/20 dark:border-indigo-500/20 light:border-stone-300/90 bg-[#0D0E20]/85 dark:bg-[#0D0E20]/85 light:bg-[#F7F6F1] shimmer-card hover-lift"
          >
            <div className="flex items-center justify-between text-xs font-mono text-amber-500 mb-2">
              <span>Graduated 2025 · CBSE</span>
              <School className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-neutral-100 dark:text-neutral-100 light:text-neutral-900 mb-1">
              Senior Secondary (Class XII · Science)
            </h3>
            <p className="text-xs text-neutral-400 dark:text-neutral-400 light:text-neutral-600 leading-relaxed">
              Rigorous quantitative foundation in Physics, Chemistry, Calculus, Linear Algebra, and Computer Science.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

