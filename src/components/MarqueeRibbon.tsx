import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TechIcon } from './TechIcons';

gsap.registerPlugin(ScrollTrigger);

export const MarqueeRibbon: React.FC = () => {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const skills = [
    { name: 'Python' },
    { name: 'C++' },
    { name: 'TypeScript' },
    { name: 'JavaScript' },
    { name: 'React' },
    { name: 'Flask' },
    { name: 'Django' },
    { name: 'PostgreSQL' },
    { name: 'SQLite' },
    { name: 'Pandas' },
    { name: 'scikit-learn' },
    { name: 'NLTK' },
    { name: 'ReportLab' },
    { name: 'Git' },
    { name: 'Tailwind CSS' },
    { name: 'Supabase' },
  ];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const anim = gsap.to(track, {
      xPercent: -50,
      duration: 35,
      ease: 'none',
      repeat: -1,
    });

    const trigger = ScrollTrigger.create({
      onUpdate: (self: { getVelocity: () => number }) => {
        const vel = Math.abs(self.getVelocity());
        if (vel > 250) {
          gsap.to(anim, {
            timeScale: 1 + Math.min(vel / 220, 3.5),
            duration: 0.2,
            overwrite: true,
            onComplete: () => {
              gsap.to(anim, { timeScale: 1, duration: 1.2 });
            },
          });
        }
      },
    });

    return () => {
      anim.kill();
      trigger.kill();
    };
  }, []);

  const items = [...skills, ...skills];

  return (
    <div className="relative py-4 border-y border-neutral-800/80 dark:border-neutral-800/80 light:border-stone-300 overflow-hidden bg-neutral-950/85 dark:bg-neutral-950/85 light:bg-[#F6F5F0] select-none my-12">
      <div
        ref={trackRef}
        className="flex items-center gap-10 w-max text-xl sm:text-2xl font-serif italic text-neutral-300 dark:text-neutral-300 light:text-neutral-700"
        style={{ willChange: 'transform' }}
      >
        {items.map((skill, idx) => (
          <React.Fragment key={idx}>
            <div className="flex items-center gap-2.5 hover:text-amber-500 transition-colors whitespace-nowrap">
              <TechIcon name={skill.name} className="w-5 h-5 not-italic shrink-0 inline-block" />
              <span>{skill.name}</span>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500/70 shrink-0 select-none" aria-hidden="true" />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
