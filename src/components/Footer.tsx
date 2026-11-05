import React, { useState, useEffect } from 'react';
import { ArrowUp, MapPin, Clock } from 'lucide-react';
import { PERSONAL_INFO } from '../data/staticData';
import { PortfolioLogo } from './PortfolioLogo';

export const Footer: React.FC = () => {
  const [delhiTime, setDelhiTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      try {
        const formatted = new Intl.DateTimeFormat('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }).format(new Date());
        setDelhiTime(formatted);
      } catch {
        setDelhiTime('Delhi, India');
      }
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="pt-10 pb-24 sm:py-12 border-t border-neutral-800/80 dark:border-neutral-800/80 light:border-stone-200 text-xs font-mono text-neutral-400 dark:text-neutral-400 light:text-neutral-600">
      <div className="gsap-reveal max-w-6xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <PortfolioLogo size="sm" showText={false} />
          <span>© 2026 {PERSONAL_INFO.name}.</span>
          <span aria-hidden="true">·</span>
          <span>Delhi University</span>
        </div>

        {/* Real-time Delhi Clock */}
        <div className="flex items-center gap-2 text-neutral-300 dark:text-neutral-300 light:text-neutral-700 bg-neutral-900/60 dark:bg-neutral-900/60 light:bg-stone-100 border border-neutral-800 dark:border-neutral-800 light:border-stone-300 px-3 py-1.5 rounded-lg">
          <MapPin className="w-3.5 h-3.5 text-amber-500" />
          <Clock className="w-3.5 h-3.5 text-neutral-400" />
          <span>Delhi (IST): <strong className="text-neutral-100 dark:text-neutral-100 light:text-neutral-900 font-mono">{delhiTime}</strong></span>
        </div>

        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-amber-500 transition-colors"
        >
          <span>Back to Top</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
};
