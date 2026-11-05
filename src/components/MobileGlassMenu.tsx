import React, { useEffect, useRef } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  FileText,
  ArrowUpRight,
  Github,
  Linkedin,
  Code2,
  Twitter,
  Mail,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/staticData';
import { soundEngine } from '../utils/soundEngine';
import { PortfolioLogo } from './PortfolioLogo';

interface NavLink {
  label: string;
  href: string;
  number: string;
  sub: string;
}

interface MobileGlassMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  soundOn: boolean;
  onToggleSound: () => void;
  navLinks: Array<{ label: string; href: string }>;
}

export const MobileGlassMenu: React.FC<MobileGlassMenuProps> = ({
  isOpen,
  onClose,
  isDark,
  onToggleTheme,
  soundOn,
  onToggleSound,
}) => {
  const menuRef = useRef<HTMLDivElement | null>(null);

  const enrichedNavLinks: NavLink[] = [
    { label: 'WORK', href: '#projects', number: '01', sub: 'Selected Works & SaaS' },
    { label: 'ABOUT', href: '#about', number: '02', sub: 'Engineering Philosophy' },
    { label: 'DISCIPLINES', href: '#disciplines', number: '03', sub: 'Web · AI · 3D · Motion' },
    { label: 'ACTIVITY', href: '#leetcode', number: '04', sub: 'LeetCode & GitHub' },
    { label: 'STACK', href: '#stack', number: '05', sub: 'Arsenal & Frameworks' },
    { label: 'CONTACT', href: '#contact', number: '06', sub: 'Direct Dispatch' },
  ];

  // Prevent background scroll when full-screen menu is open & listen for ESC key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          soundEngine.playClick();
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      ref={menuRef}
      className="fixed inset-0 z-[100] md:hidden flex flex-col justify-between overflow-y-auto overflow-x-hidden bg-[#07081A]/92 dark:bg-[#07081A]/94 light:bg-[#ECEAE4]/95 backdrop-blur-2xl transition-all duration-300 animate-in fade-in slide-in-from-right-6"
    >
      {/* Crystalline Glass Shimmer & Iridescent Ambient Aura */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.2),transparent_50%),radial-gradient(circle_at_20%_80%,rgba(245,158,11,0.15),transparent_50%)]"
        aria-hidden="true"
      />

      {/* Subtle 4-Column Architectural Grid Hairlines */}
      <div
        className="pointer-events-none fixed inset-0 grid grid-cols-4 px-6 opacity-[0.06] dark:opacity-[0.06] light:opacity-[0.08] z-0"
        aria-hidden="true"
      >
        <div className="border-l border-indigo-200 dark:border-indigo-200 light:border-neutral-900 h-full" />
        <div className="border-l border-indigo-200 dark:border-indigo-200 light:border-neutral-900 h-full" />
        <div className="border-l border-indigo-200 dark:border-indigo-200 light:border-neutral-900 h-full" />
        <div className="border-l border-r border-indigo-200 dark:border-indigo-200 light:border-neutral-900 h-full" />
      </div>

      {/* Top Glass Control Bar: Logo + Audio Toggle + Close Button */}
      <div className="relative z-10 p-5 sm:p-6 flex items-center justify-between border-b border-indigo-500/20 dark:border-indigo-500/20 light:border-stone-300/80 bg-neutral-950/40 dark:bg-neutral-950/40 light:bg-white/40 backdrop-blur-md">
        <a
          href="#top"
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="focus:outline-none"
        >
          <PortfolioLogo size="md" isDark={isDark} />
        </a>

        <div className="flex items-center gap-3">
          {/* Sound Synthesizer Toggle */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onToggleSound();
            }}
            aria-label={soundOn ? 'Sound on' : 'Sound off'}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-medium border border-indigo-500/25 dark:border-indigo-500/25 light:border-stone-300 bg-neutral-900/60 dark:bg-neutral-900/60 light:bg-white text-neutral-200 dark:text-neutral-200 light:text-neutral-900 shadow-sm"
          >
            {soundOn ? (
              <Volume2 className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
            )}
            <span className="text-[10px] tracking-wider uppercase font-semibold">
              {soundOn ? '~ ON' : '~ OFF'}
            </span>
          </button>

          {/* Frosted Glass Close Button */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            aria-label="Close navigation menu"
            className="w-10 h-10 rounded-xl border border-indigo-500/30 dark:border-indigo-500/30 light:border-stone-300 bg-neutral-900/80 dark:bg-neutral-900/80 light:bg-white text-neutral-100 dark:text-neutral-100 light:text-neutral-900 flex items-center justify-center hover:border-amber-500 hover:text-amber-400 transition-colors shadow-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Center Body: Editorial Large Navigation Links */}
      <div className="relative z-10 px-6 py-8 flex flex-col justify-center my-auto">
        <div className="flex items-center gap-2 mb-4 text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-400 light:text-neutral-500">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>PORTFOLIO DIRECTORY</span>
        </div>

        <nav className="flex flex-col space-y-1">
          {enrichedNavLinks.map((item, idx) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              onMouseEnter={() => soundEngine.playHover()}
              style={{ animationDelay: `${idx * 45}ms` }}
              className="group flex items-center justify-between py-3.5 px-3 rounded-2xl border border-transparent hover:border-indigo-500/30 hover:bg-neutral-900/50 dark:hover:bg-neutral-900/50 light:hover:bg-white/60 transition-all duration-200"
            >
              <div className="flex items-baseline gap-4">
                <span className="text-xs font-mono font-semibold text-neutral-400 group-hover:text-amber-400 transition-colors">
                  {item.number}
                </span>
                <div>
                  <span className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-neutral-100 dark:text-neutral-100 light:text-[#141413] group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                    {item.label}
                  </span>
                  <span className="block text-[10px] font-mono text-neutral-400 dark:text-neutral-400 light:text-neutral-500 tracking-wider mt-0.5">
                    {item.sub}
                  </span>
                </div>
              </div>

              <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-amber-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          ))}
        </nav>
      </div>

      {/* Bottom Glass Drawer Controls: Theme Switcher, Resume CTA & Social Links */}
      <div className="relative z-10 p-5 sm:p-6 border-t border-indigo-500/20 dark:border-indigo-500/20 light:border-stone-300/80 bg-[#0D0E20]/90 dark:bg-[#0D0E20]/90 light:bg-[#F6F5F0]/95 backdrop-blur-xl shadow-2xl rounded-t-3xl">
        {/* Availability Badge */}
        <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-neutral-800/60 dark:border-neutral-800/60 light:border-stone-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]" />
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] font-semibold text-emerald-400 dark:text-emerald-400 light:text-emerald-700">
              AVAILABLE FOR 2026 ROLES
            </span>
          </div>
          <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-400 light:text-neutral-500 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-amber-500" />
            <span>Delhi, IN</span>
          </span>
        </div>

        {/* Action Row: Theme Switcher + Résumé Download */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Integrated WAKE / DREAM Switcher */}
          <div className="flex items-center p-1 rounded-xl border border-neutral-700/60 dark:border-neutral-700/60 light:border-stone-300 bg-neutral-950/70 dark:bg-neutral-950/70 light:bg-white shadow-sm">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                if (isDark) onToggleTheme();
              }}
              className={`flex-1 py-2 rounded-lg text-[10px] font-mono uppercase tracking-wider font-bold transition-all ${
                !isDark
                  ? 'bg-neutral-900 text-neutral-100 shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              WAKE
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                if (!isDark) onToggleTheme();
              }}
              className={`flex-1 py-2 rounded-lg text-[10px] font-mono uppercase tracking-wider font-bold transition-all ${
                isDark
                  ? 'bg-[#ECEAE4] text-neutral-950 shadow-md'
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              DREAM
            </button>
          </div>

          {/* Résumé Download Pill */}
          <a
            href={PERSONAL_INFO.resumeUrl}
            download="Sachin_Resume.pdf"
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-colors shadow-sm font-mono uppercase tracking-wider"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Résumé</span>
          </a>
        </div>

        {/* Social Connection Matrix */}
        <div className="flex items-center justify-between gap-2 pt-2 text-neutral-300 dark:text-neutral-300 light:text-neutral-700 text-xs font-mono">
          <a
            href={PERSONAL_INFO.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="p-2 rounded-lg hover:text-amber-400 hover:bg-neutral-800/40 transition-colors"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href={PERSONAL_INFO.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="p-2 rounded-lg hover:text-amber-400 hover:bg-neutral-800/40 transition-colors"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href={PERSONAL_INFO.leetcodeUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LeetCode"
            className="p-2 rounded-lg hover:text-amber-400 hover:bg-neutral-800/40 transition-colors"
          >
            <Code2 className="w-4 h-4" />
          </a>
          <a
            href={PERSONAL_INFO.xUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X Twitter"
            className="p-2 rounded-lg hover:text-amber-400 hover:bg-neutral-800/40 transition-colors"
          >
            <Twitter className="w-4 h-4" />
          </a>
          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            aria-label="Email"
            className="p-2 rounded-lg hover:text-amber-400 hover:bg-neutral-800/40 transition-colors"
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
