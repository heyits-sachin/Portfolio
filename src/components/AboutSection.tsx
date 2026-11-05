import React from 'react';
import { BookOpen, MapPin, Briefcase, Terminal } from 'lucide-react';
import { PERSONAL_INFO } from '../data/staticData';
import { ParticlePortrait } from './ParticlePortrait';

interface AboutSectionProps {
  isDark?: boolean;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ isDark = false }) => {
  return (
    <section
      id="about"
      className="depth-section py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-8 relative border-t border-neutral-800/40 dark:border-neutral-800/40 light:border-stone-300/70"
    >
      {/* Top Kicker: [01] ABOUT (matches 00:16 - 00:18 in video) */}
      <div className="mb-8 sm:mb-10 gsap-reveal">
        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-400 light:text-neutral-600">
          [01] ABOUT
        </span>
      </div>

      {/* Daiki Fujita Editorial Statement with Progressive Focus Reveal & Italic Serif "memory" (00:16-00:18) */}
      <div className="max-w-4xl mb-10 sm:mb-14 gsap-reveal">
        <h2 className="text-2xl sm:text-5xl md:text-[54px] font-bold uppercase tracking-[-0.035em] leading-[1.08] text-neutral-100 dark:text-neutral-100 light:text-[#141413]">
          {'I DESIGN AND BUILD APPLICATIONS THAT STAY WITH YOU LIKE A'.split(' ').map((word, idx) => (
            <React.Fragment key={`about-w1-${idx}`}>
              <span className="hover-word">{word}</span>{' '}
            </React.Fragment>
          ))}
          <span className="font-serif italic font-normal lowercase text-amber-500 dark:text-amber-400 light:text-[#141413] px-1 hover-word">
            memory
          </span>{' '}
          {'— WHERE FULL-STACK, AI, MOTION AND INTERACTION BECOME ONE EXPERIENCE.'.split(' ').map((word, idx) => (
            <React.Fragment key={`about-w2-${idx}`}>
              <span className="hover-word">{word}</span>{' '}
            </React.Fragment>
          ))}
        </h2>
      </div>

      {/* Two-Column Editorial Narrative + 3D Particle Portrait (matches 00:17 - 00:18 layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-start">
        {/* Left 7 Columns: Bilingual / Dual-Column Editorial Bio + 2x2 Fact Matrix */}
        <div className="lg:col-span-7 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm leading-relaxed text-neutral-300 dark:text-neutral-300 light:text-neutral-700 gsap-reveal">
            <p>
              I work across the digital fields of full-stack web engineering, Python backend architecture, applied machine learning, and interactive motion—shaping software that harmonizes reliability with craft. At{' '}
              <strong className="text-neutral-100 dark:text-neutral-100 light:text-neutral-950 font-semibold">
                Acharya Narendra Dev College, University of Delhi
              </strong>
              , I build systems with real authentication, 15-table production schemas, and live cloud deployments.
            </p>

            <p>
              My flagship platform{' '}
              <a
                href="https://quikfolio.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-500 dark:text-amber-400 light:text-purple-700 underline underline-offset-4 font-semibold"
              >
                QuickFolio
              </a>{' '}
              serves 75 Flask routes with OAuth 2.0 and ReportLab PDF compilation, while my clinical diagnostic suite runs daily inside a working pathology lab in Delhi. Alongside production web apps, I solve algorithmic challenges in C++ on LeetCode.
            </p>
          </div>

          {/* 2x2 Editorial Fact Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 gsap-stagger-grid">
            <div className="gsap-stagger-item p-4 rounded-2xl border border-neutral-800/80 dark:border-neutral-800/80 light:border-stone-300 bg-neutral-900/50 dark:bg-neutral-900/50 light:bg-[#F6F5F0] shimmer-card">
              <div className="text-[10px] font-mono uppercase tracking-widest text-amber-500 dark:text-amber-400 light:text-purple-700 mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Current Degree</span>
              </div>
              <div className="text-sm font-semibold text-neutral-100 dark:text-neutral-100 light:text-neutral-900">
                B.Sc. (Hons) Computer Science
              </div>
              <div className="text-xs text-neutral-400 dark:text-neutral-400 light:text-neutral-600 mt-0.5">
                ANDC, University of Delhi · 2025 – 2028
              </div>
            </div>

            <div className="gsap-stagger-item p-4 rounded-2xl border border-neutral-800/80 dark:border-neutral-800/80 light:border-stone-300 bg-neutral-900/50 dark:bg-neutral-900/50 light:bg-[#F6F5F0] shimmer-card">
              <div className="text-[10px] font-mono uppercase tracking-widest text-amber-500 dark:text-amber-400 light:text-purple-700 mb-1 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Seeking</span>
              </div>
              <div className="text-sm font-semibold text-neutral-100 dark:text-neutral-100 light:text-neutral-900">
                SWE &amp; Data Internships
              </div>
              <div className="text-xs text-neutral-400 dark:text-neutral-400 light:text-neutral-600 mt-0.5">
                Available for 2026 Engineering Roles
              </div>
            </div>

            <div className="gsap-stagger-item p-4 rounded-2xl border border-neutral-800/80 dark:border-neutral-800/80 light:border-stone-300 bg-neutral-900/50 dark:bg-neutral-900/50 light:bg-[#F6F5F0] shimmer-card">
              <div className="text-[10px] font-mono uppercase tracking-widest text-amber-500 dark:text-amber-400 light:text-purple-700 mb-1 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>Core Stack</span>
              </div>
              <div className="text-xs font-mono text-neutral-300 dark:text-neutral-300 light:text-neutral-700 leading-relaxed">
                Python · Flask · Django · TS · SQL · C++
              </div>
            </div>

            <div className="gsap-stagger-item p-4 rounded-2xl border border-neutral-800/80 dark:border-neutral-800/80 light:border-stone-300 bg-neutral-900/50 dark:bg-neutral-900/50 light:bg-[#F6F5F0] shimmer-card">
              <div className="text-[10px] font-mono uppercase tracking-widest text-amber-500 dark:text-amber-400 light:text-purple-700 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>Based In</span>
              </div>
              <div className="text-sm font-semibold text-neutral-100 dark:text-neutral-100 light:text-neutral-900">
                Delhi, India
              </div>
              <div className="text-xs text-neutral-400 dark:text-neutral-400 light:text-neutral-600 mt-0.5">
                Open to Remote &amp; Hybrid
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Interactive 3D Particle Point-Cloud Portrait from Sachin's Photo */}
        <div className="lg:col-span-5 gsap-reveal">
          <div className="rounded-3xl border border-neutral-800/80 dark:border-neutral-800/80 light:border-stone-300 bg-[#07070D]/95 dark:bg-[#07070D]/95 light:bg-neutral-900 overflow-hidden shadow-2xl relative group">
            <ParticlePortrait photoUrl={PERSONAL_INFO.photoUrl} isDark={isDark} />
            <div className="px-4 sm:px-5 py-3.5 border-t border-neutral-800/80 bg-neutral-950/90 flex items-center justify-between gap-2 text-[11px] sm:text-xs font-mono text-neutral-400">
              <span>Interactive 3D Portrait · {PERSONAL_INFO.name}</span>
              <span className="text-amber-500">Touch / Hover 3D</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
