import React, { useState, useEffect } from 'react';
import { Menu, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { PortfolioLogo } from './PortfolioLogo';
import { MobileGlassMenu } from './MobileGlassMenu';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isDark, onToggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(soundEngine.getEnabled());

  useEffect(() => {
    return soundEngine.subscribe((enabled) => setSoundOn(enabled));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'WORK', href: '#projects' },
    { label: 'ABOUT', href: '#about' },
    { label: 'DISCIPLINES', href: '#disciplines' },
    { label: 'ACTIVITY', href: '#leetcode' },
    { label: 'STACK', href: '#stack' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'py-3 bg-[#07081A]/88 dark:bg-[#07081A]/88 light:bg-[#ECEAE4]/90 backdrop-blur-xl border-b border-indigo-500/15 dark:border-indigo-500/15 light:border-stone-300/80 shadow-[0_4px_30px_rgba(0,0,0,0.15)]'
            : 'py-4 sm:py-5 bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-3 sm:gap-6">
          {/* Zone 1 (Left): Geometric Monogram Logo + Brand Wordmark */}
          <a
            href="#top"
            onMouseEnter={() => soundEngine.playHover()}
            onClick={() => soundEngine.playClick()}
            className="flex items-center gap-2 focus:outline-none"
            aria-label="Sachin Portfolio — Home"
          >
            <PortfolioLogo size="md" isDark={isDark} />
          </a>

          {/* Zone 2 (Center-Left): Clean Single-Line Navigation (Desktop Only) */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-7 text-[11px] font-mono font-semibold uppercase tracking-[0.16em] text-neutral-300 dark:text-neutral-300 light:text-[#141413]"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                data-text={link.label}
                onMouseEnter={() => soundEngine.playHover()}
                onClick={() => soundEngine.playClick()}
                className="hover-roll-text whitespace-nowrap shrink-0 relative py-0.5"
              >
                <span>{link.label}</span>
              </a>
            ))}
          </nav>

          {/* Zone 3 (Right): ~ SOUND ON & CONTACT (Desktop) */}
          <div className="hidden md:flex items-center gap-6 shrink-0">
            {/* Daiki Fujita "~ SOUND ON" Interactive Synthesizer Button */}
            <button
              type="button"
              onClick={() => soundEngine.toggle()}
              onMouseEnter={() => soundEngine.playHover()}
              aria-pressed={soundOn}
              aria-label={soundOn ? 'Sound on — turn it off' : 'Sound off — turn it on'}
              className="inline-flex items-center gap-2 py-1.5 px-1 text-[11px] font-mono font-semibold uppercase tracking-[0.16em] text-neutral-200 dark:text-neutral-200 light:text-[#141413] hover:text-amber-500 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span
                className={`inline-block text-sm leading-none transition-transform duration-300 ${
                  soundOn ? 'text-purple-500 dark:text-amber-400 scale-110' : 'opacity-60'
                }`}
                aria-hidden="true"
              >
                ~
              </span>
              <span>{soundOn ? 'SOUND ON' : 'SOUND OFF'}</span>
            </button>

            {/* Primary Action Link: CONTACT */}
            <a
              href="#contact"
              data-text="CONTACT"
              onMouseEnter={() => soundEngine.playHover()}
              onClick={() => soundEngine.playClick()}
              className="hover-roll-text inline-flex items-center text-[11px] font-mono font-bold uppercase tracking-[0.16em] text-neutral-100 dark:text-neutral-100 light:text-[#141413] whitespace-nowrap shrink-0"
            >
              <span>CONTACT</span>
            </a>
          </div>

          {/* Mobile Right: Sleek Glass Trigger Pill replacing standard header elements */}
          <div className="flex md:hidden items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setMobileMenuOpen(true);
              }}
              onMouseEnter={() => soundEngine.playHover()}
              aria-label="Open mobile navigation menu"
              aria-expanded={mobileMenuOpen}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-indigo-500/30 dark:border-indigo-500/30 light:border-stone-300 bg-[#0D0E20]/80 dark:bg-[#0D0E20]/80 light:bg-white/85 text-neutral-100 dark:text-neutral-100 light:text-neutral-900 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:border-amber-500/70 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-[0.18em] font-bold">
                MENU
              </span>
              <Menu className="w-3.5 h-3.5 text-neutral-300 ml-0.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Slide-In Mobile Navigation Menu with Project-Card Glass Aesthetic */}
      <MobileGlassMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        isDark={isDark}
        onToggleTheme={onToggleTheme}
        soundOn={soundOn}
        onToggleSound={() => soundEngine.toggle()}
        navLinks={navLinks}
      />

      {/* Daiki Fujita Signature Bottom-Center WAKE / DREAM Pill Switcher (matches 00:07 - 00:46 in video) */}
      <div
        role="group"
        aria-label="Theme Mode Switcher (Wake Light Mode or Dream Dark Mode)"
        className="fixed bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center p-1 sm:p-1.5 rounded-full border border-neutral-700/50 dark:border-neutral-700/60 light:border-stone-300/90 bg-[#16172B]/90 dark:bg-[#16172B]/90 light:bg-[#E4E1DA]/95 backdrop-blur-md shadow-[0_12px_36px_rgba(0,0,0,0.22)]"
      >
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            if (isDark) onToggleTheme();
          }}
          onMouseEnter={() => soundEngine.playHover()}
          aria-pressed={!isDark}
          className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.16em] font-bold transition-all duration-300 cursor-pointer ${
            !isDark
              ? 'bg-[#1D1D1B] text-[#ECEAE4] shadow-md'
              : 'text-neutral-400 hover:text-neutral-200'
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
          onMouseEnter={() => soundEngine.playHover()}
          aria-pressed={isDark}
          className={`inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.16em] font-bold transition-all duration-300 cursor-pointer ${
            isDark
              ? 'bg-[#ECEAE4] text-[#141413] shadow-[0_0_24px_rgba(168,85,247,0.45)]'
              : 'text-[#1D1D1B] hover:opacity-80'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full daiki-conic-dot shadow-[0_0_8px_rgba(168,85,247,0.8)]" aria-hidden="true" />
          <span>DREAM</span>
        </button>
      </div>
    </>
  );
};
