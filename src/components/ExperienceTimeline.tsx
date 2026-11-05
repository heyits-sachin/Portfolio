import React from 'react';
import { Briefcase } from 'lucide-react';
import { WORK_EXPERIENCES } from '../data/staticData';

export const ExperienceTimeline: React.FC = () => {
  return (
    <section id="work" className="depth-section py-16 sm:py-20 max-w-6xl mx-auto px-4 sm:px-8 relative">
      <div className="mb-12 gsap-reveal">
        <div className="flex items-center gap-3 text-xs font-mono tracking-widest uppercase text-amber-500 mb-2">
          <span className="w-6 h-px bg-amber-500" />
          <span>Professional Experience</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-normal text-neutral-100 dark:text-neutral-100 light:text-neutral-900 tracking-tight">
          Where I've <span className="font-serif italic text-amber-500 dark:text-amber-400">built.</span>
        </h2>
      </div>

      <div className="gsap-timeline-track relative border-l border-neutral-800/80 dark:border-neutral-800/80 light:border-stone-200 ml-3 sm:ml-4 space-y-12">
        {/* GSAP Animated Glowing Vertical Progress Line */}
        <div
          className="gsap-timeline-progress absolute -left-[1px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-amber-500 via-indigo-500 to-amber-400 origin-top"
          style={{ willChange: 'transform' }}
        />

        {WORK_EXPERIENCES.map((job) => (
          <div key={job.company + job.period} className="gsap-reveal relative pl-6 sm:pl-8 group">
            {/* Timeline Dot */}
            <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full border-2 border-neutral-950 dark:border-neutral-950 light:border-white bg-amber-500 shadow-[0_0_12px_#F59E0B] group-hover:scale-125 transition-transform" />

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
              <h3 className="text-xl sm:text-2xl font-bold text-neutral-100 dark:text-neutral-100 light:text-neutral-900 flex flex-wrap items-center gap-2">
                <span>{job.title}</span>
                <span className="text-neutral-500 font-normal">·</span>
                {job.company === 'SPIE ANDC' ? (
                  <a
                    href="https://www.spieandc.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-serif italic text-amber-500 dark:text-amber-400 font-normal border-b border-dashed border-amber-500/60 hover:border-amber-400 transition-colors"
                  >
                    {job.company} ↗
                  </a>
                ) : (
                  <span className="font-serif italic text-amber-500 dark:text-amber-400 font-normal">
                    {job.company}
                  </span>
                )}
              </h3>
              <span className="text-xs font-mono text-neutral-400 dark:text-neutral-400 light:text-neutral-600 shrink-0">
                {job.period}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 dark:text-neutral-400 light:text-neutral-500 mb-4">
              <Briefcase className="w-3.5 h-3.5 text-neutral-500" />
              <span>{job.location}</span>
              <span aria-hidden="true">·</span>
              <span>{job.type}</span>
            </div>

            <ul className="space-y-2 mb-4">
              {job.description.map((desc, i) => (
                <li
                  key={i}
                  className="text-sm text-neutral-300 dark:text-neutral-300 light:text-neutral-700 leading-relaxed flex items-start gap-2.5"
                >
                  <span className="text-amber-500 font-mono text-xs mt-1 shrink-0">→</span>
                  <span>{desc}</span>
                </li>
              ))}
            </ul>

            {/* Clean unboxed skills */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-neutral-400 dark:text-neutral-400 light:text-neutral-500">
              {job.skills.map((s, idx) => (
                <React.Fragment key={s}>
                  <span className="text-neutral-400 dark:text-neutral-400 light:text-neutral-600">{s}</span>
                  {idx < job.skills.length - 1 && <span aria-hidden="true">·</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
