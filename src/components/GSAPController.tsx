import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { PERSONAL_INFO } from '../data/staticData';
import { soundEngine } from '../utils/soundEngine';
import { SachinSignature } from './SachinSignature';
import {
  getSectionScrollRevealConfig,
  getStaggerBatchConfig,
  getTitleStaggerConfig,
  getContentBlockStaggerConfig,
} from '../utils/scrollTriggerConfig';

gsap.registerPlugin(ScrollTrigger);
gsap.ticker.lagSmoothing(0);

export const GSAPController: React.FC = () => {
  const [showLandingGate, setShowLandingGate] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') return false;
    }
    return true;
  });

  const [isStoneShattered, setIsStoneShattered] = useState(false);
  const [sigReplayKey, setSigReplayKey] = useState(0);

  const isOpeningRef = useRef(false);
  const landingTrackRef = useRef<HTMLDivElement | null>(null);

  // Listen to Glass Stone shatter / recover events from DaikiCrystalCanvas
  useEffect(() => {
    const onStoneState = (e: Event) => {
      const custom = e as CustomEvent<{ shattered: boolean }>;
      if (custom.detail) {
        setIsStoneShattered(custom.detail.shattered);
        if (custom.detail.shattered) {
          setSigReplayKey((prev) => prev + 1);
        }
      }
    };
    window.addEventListener('glass-stone-state', onStoneState);
    return () => window.removeEventListener('glass-stone-state', onStoneState);
  }, []);

  const openWebsiteWithAnimation = (enableAudio = true) => {
    if (isOpeningRef.current || !showLandingGate) return;
    isOpeningRef.current = true;

    if (enableAudio && !soundEngine.getEnabled()) {
      soundEngine.enable();
    }
    soundEngine.playClick();

    // Ensure page is at the very top so the starting page matches image_33116dc5.png
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });

    const mainEl = document.getElementById('top');
    const footerEl = document.querySelector('footer') as HTMLElement | null;

    const tl = gsap.timeline({
      onComplete: () => {
        setShowLandingGate(false);
        isOpeningRef.current = false;
        document.body.style.overflow = '';
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      },
    });

    // 1. Top & Bottom metadata strips slide away
    tl.to(
      '.landing-top-row',
      {
        y: -32,
        opacity: 0,
        duration: 0.48,
        ease: 'power3.in',
      },
      0
    );

    tl.to(
      '.landing-bottom-row',
      {
        y: 32,
        opacity: 0,
        duration: 0.48,
        ease: 'power3.in',
      },
      0
    );

    // 2. Giant "Sites for waking." kinetic headline & signature zoom forward in 3D space
    tl.to(
      '.landing-kinetic-stage',
      {
        scale: 1.34,
        z: 180,
        filter: 'blur(14px)',
        opacity: 0,
        duration: 0.72,
        ease: 'expo.inOut',
      },
      0.04
    );

    // 3. Dissolve landing gate backdrop
    tl.to(
      '.preloader-screen',
      {
        opacity: 0,
        duration: 0.68,
        ease: 'power2.inOut',
      },
      0.18
    );

    // 4. Simultaneously animate in the Starting Page (#top) inside the same timeline
    if (mainEl) {
      mainEl.style.pointerEvents = 'auto';
      tl.fromTo(
        mainEl,
        {
          scale: 0.92,
          y: 56,
          opacity: 0,
          filter: 'blur(8px)',
          transformOrigin: 'center top',
        },
        {
          scale: 1,
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.82,
          ease: 'expo.out',
          clearProps: 'transform,filter',
        },
        0.12
      );
    }
    if (footerEl) {
      tl.to(footerEl, { opacity: 1, duration: 0.55 }, 0.28);
    }
  };

  // Lock body scroll and hide #top while the full-screen Landing Gate is active
  useEffect(() => {
    const mainEl = document.getElementById('top');
    const footerEl = document.querySelector('footer') as HTMLElement | null;

    if (!showLandingGate) {
      document.body.style.overflow = '';
      if (mainEl) {
        mainEl.style.opacity = '1';
        mainEl.style.pointerEvents = 'auto';
      }
      if (footerEl) {
        footerEl.style.opacity = '1';
      }
      return;
    }

    document.body.style.overflow = 'hidden';
    if (mainEl && !isOpeningRef.current) {
      mainEl.style.opacity = '0';
      mainEl.style.pointerEvents = 'none';
    }
    if (footerEl && !isOpeningRef.current) {
      footerEl.style.opacity = '0';
    }

    const handleHeaderNavClick = () => {
      openWebsiteWithAnimation(true);
    };

    const navLinks = document.querySelectorAll('header a');
    navLinks.forEach((link) => link.addEventListener('click', handleHeaderNavClick));

    return () => {
      document.body.style.overflow = '';
      navLinks.forEach((link) => link.removeEventListener('click', handleHeaderNavClick));
    };
  }, [showLandingGate]);

  // Interactive cursor horizontal glide on the Landing Gate kinetic headline
  useEffect(() => {
    if (!showLandingGate) return;
    const track = landingTrackRef.current;
    if (!track) return;

    const qx = gsap.quickTo(track, 'xPercent', { duration: 0.9, ease: 'power3.out' });

    const onMove = (e: MouseEvent) => {
      const ratio = e.clientX / Math.max(window.innerWidth, 1);
      qx(-ratio * 26);
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [showLandingGate]);

  // Daiki Fujita Inspired Section Fade-In & Slide-Up ScrollTrigger Animations
  useEffect(() => {
    // Wait until the Landing Gate is dismissed so all DOM bounding boxes are at true coordinates
    if (showLandingGate) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const sectionCfg = getSectionScrollRevealConfig(false);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        onUpdate: (self) => {
          soundEngine.modulateScrollDepth(self.getVelocity());
        },
      });

      // 1. Portfolio Sections (.depth-section): Orchestrated Staggered Reveal
      const depthSections = gsap.utils.toArray<HTMLElement>('.depth-section');
      const titleCfg = getTitleStaggerConfig(false);
      const contentCfg = getContentBlockStaggerConfig(false);

      depthSections.forEach((sec) => {
        // Base section fade and scale
        gsap.fromTo(
          sec,
          {
            opacity: sectionCfg.from.opacity,
            y: sectionCfg.from.y,
            scale: sectionCfg.from.scale,
            transformOrigin: 'center top',
          },
          {
            opacity: sectionCfg.to.opacity,
            y: sectionCfg.to.y,
            scale: sectionCfg.to.scale,
            duration: sectionCfg.to.duration,
            ease: sectionCfg.to.ease,
            scrollTrigger: {
              trigger: sec,
              start: sectionCfg.triggerStart,
              end: sectionCfg.triggerEnd,
              toggleActions: sectionCfg.toggleActions,
              fastScrollEnd: sectionCfg.fastScrollEnd,
            },
          }
        );

        // A. Section Title & Kicker Staggered Sequence
        const titleNodes: HTMLElement[] = [];
        // Section kicker element (e.g., [01] ABOUT)
        const kicker = sec.querySelector<HTMLElement>('.text-\\[11px\\].font-mono, .section-kicker, span[class*="tracking-\\[0.2em\\]"]');
        if (kicker && kicker.parentElement) {
          titleNodes.push(kicker.parentElement);
        }
        // Section main heading (h2 / h3)
        const headings = sec.querySelectorAll<HTMLElement>('h2, h3');
        headings.forEach((h) => {
          if (!h.closest('.gsap-discipline-row') && !h.closest('.gsap-stagger-item') && !titleNodes.includes(h)) {
            titleNodes.push(h);
          }
        });

        if (titleNodes.length > 0) {
          gsap.fromTo(
            titleNodes,
            {
              y: titleCfg.from.y,
              opacity: titleCfg.from.opacity,
              rotateX: titleCfg.from.rotateX,
              transformPerspective: 900,
              transformOrigin: 'left bottom',
            },
            {
              y: titleCfg.to.y,
              opacity: titleCfg.to.opacity,
              rotateX: titleCfg.to.rotateX,
              duration: titleCfg.to.duration,
              stagger: titleCfg.to.stagger,
              ease: titleCfg.to.ease,
              scrollTrigger: {
                trigger: titleNodes[0],
                start: titleCfg.triggerStart,
                toggleActions: titleCfg.toggleActions,
                fastScrollEnd: titleCfg.fastScrollEnd,
              },
            }
          );
        }

        // B. Section Content Blocks & Cards Staggered Sequence
        const contentBlocks = sec.querySelectorAll<HTMLElement>(
          '.gsap-reveal:not(h2):not(h3), .bento-card, .depth-card, [data-content-block]'
        );
        const filteredBlocks = Array.from(contentBlocks).filter((el) => {
          return !titleNodes.includes(el) && !el.closest('.gsap-stagger-grid') && !el.closest('.gsap-discipline-row');
        });

        if (filteredBlocks.length > 0) {
          gsap.fromTo(
            filteredBlocks,
            {
              y: contentCfg.from.y,
              opacity: contentCfg.from.opacity,
              scale: contentCfg.from.scale,
            },
            {
              y: contentCfg.to.y,
              opacity: contentCfg.to.opacity,
              scale: contentCfg.to.scale,
              duration: contentCfg.to.duration,
              stagger: contentCfg.to.stagger,
              ease: contentCfg.to.ease,
              scrollTrigger: {
                trigger: filteredBlocks[0],
                start: contentCfg.triggerStart,
                toggleActions: contentCfg.toggleActions,
                fastScrollEnd: contentCfg.fastScrollEnd,
              },
            }
          );
        }
      });

      // 2. Staggered Card Grids (.gsap-stagger-grid > .gsap-stagger-item)
      const staggerGrids = gsap.utils.toArray<HTMLElement>('.gsap-stagger-grid');
      staggerGrids.forEach((grid) => {
        const items = grid.querySelectorAll<HTMLElement>('.gsap-stagger-item');
        if (items.length === 0) return;
        const batchCfg = getStaggerBatchConfig(items.length, false);
        gsap.fromTo(
          items,
          {
            opacity: batchCfg.from.opacity,
            y: batchCfg.from.y,
            scale: batchCfg.from.scale,
          },
          {
            opacity: batchCfg.to.opacity,
            y: batchCfg.to.y,
            scale: batchCfg.to.scale,
            duration: batchCfg.to.duration,
            stagger: batchCfg.to.stagger,
            ease: batchCfg.to.ease,
            scrollTrigger: {
              trigger: grid,
              start: batchCfg.triggerStart,
              toggleActions: batchCfg.toggleActions,
              fastScrollEnd: batchCfg.fastScrollEnd,
            },
          }
        );
      });

      // 3. Disciplines Stack Rows (.gsap-discipline-row): Staggered Slide-Up
      const disciplineSection = document.getElementById('disciplines');
      const disciplineRows = gsap.utils.toArray<HTMLElement>('.gsap-discipline-row');
      if (disciplineSection && disciplineRows.length > 0) {
        gsap.fromTo(
          disciplineRows,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.78,
            stagger: 0.09,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: disciplineSection,
              start: 'top 84%',
              toggleActions: 'play none none reverse',
              fastScrollEnd: true,
            },
          }
        );
      }

      // 4. Serif Italic Accents Horizontal Glide
      const serifAccents = gsap.utils.toArray<HTMLElement>('main h2 .font-serif, main h3 .font-serif');
      serifAccents.forEach((word) => {
        gsap.fromTo(
          word,
          { x: -10, opacity: 0.7 },
          {
            x: 4,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: word,
              start: 'top 95%',
              end: 'bottom 25%',
              scrub: 0.5,
            },
          }
        );
      });

      // 5. Contact "SAY HELLO." Per-Character Cascade
      const charContainers = gsap.utils.toArray<HTMLElement>('#contact h2');
      charContainers.forEach((container) => {
        const chars = container.querySelectorAll('.gsap-char');
        if (chars.length > 0) {
          gsap.fromTo(
            chars,
            { y: 48, opacity: 0, rotateX: -35, transformPerspective: 800 },
            {
              y: 0,
              opacity: 1,
              rotateX: 0,
              duration: 0.72,
              stagger: 0.045,
              ease: 'back.out(1.6)',
              scrollTrigger: {
                trigger: container,
                start: 'top 88%',
                toggleActions: 'play none none reverse',
                fastScrollEnd: true,
              },
            }
          );
        }
      });

      // 9. Numeric Stat Counters (reads live data-gsap-count attribute dynamically so live LeetCode updates are preserved)
      const counters = gsap.utils.toArray<HTMLElement>('[data-gsap-count]');
      counters.forEach((el) => {
        const initialTarget = parseInt(el.getAttribute('data-gsap-count') || '0', 10);
        const suffix = el.getAttribute('data-gsap-suffix') || '';
        if (isNaN(initialTarget)) return;

        const obj = { progress: 0 };
        gsap.to(obj, {
          progress: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 92%',
            once: true,
          },
          onUpdate: () => {
            const liveTarget = parseInt(el.getAttribute('data-gsap-count') || String(initialTarget), 10);
            el.textContent = `${Math.round(obj.progress * liveTarget)}${suffix}`;
          },
          onComplete: () => {
            const liveTarget = parseInt(el.getAttribute('data-gsap-count') || String(initialTarget), 10);
            el.textContent = `${liveTarget}${suffix}`;
          },
        });
      });

      // 10. Experience Timeline Glowing Vertical Progress Line
      const timelineLine = document.querySelector<HTMLElement>('.gsap-timeline-progress');
      const timelineTrack = document.querySelector<HTMLElement>('.gsap-timeline-track');
      if (timelineLine && timelineTrack) {
        gsap.fromTo(
          timelineLine,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: timelineTrack,
              start: 'top 75%',
              end: 'bottom 35%',
              scrub: 0.4,
            },
          }
        );
      }

      ScrollTrigger.refresh();
    });

    return () => {
      ctx.revert();
    };
  }, [showLandingGate]);

  // Custom Cursor & Magnetic Elements
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cursor = document.getElementById('gsap-cursor');
    if (!cursor) return;

    const qx = gsap.quickTo(cursor, 'x', { duration: 0.22, ease: 'power3.out' });
    const qy = gsap.quickTo(cursor, 'y', { duration: 0.22, ease: 'power3.out' });

    const handleMouseMove = (e: MouseEvent) => {
      qx(e.clientX);
      qy(e.clientY);
    };

    const handlePointerOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const hoverWord = target.closest('.hover-word, .hover-roll-text');
      if (hoverWord) {
        soundEngine.playHover();
      }
      if (target.closest('a, button, input, [role="button"], .hover-word, .hover-roll-text')) {
        cursor.classList.add('cursor-hover');
      } else {
        cursor.classList.remove('cursor-hover');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handlePointerOver);

    const magneticEls = document.querySelectorAll<HTMLElement>('.mag');
    const cleanupHandlers: Array<() => void> = [];

    magneticEls.forEach((el) => {
      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.24;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.24;
        gsap.to(el, { x, y, duration: 0.3, ease: 'power2.out' });
      };

      const onLeave = () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
      };

      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);
      cleanupHandlers.push(() => {
        el.removeEventListener('mousemove', onMove);
        el.removeEventListener('mouseleave', onLeave);
      });
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handlePointerOver);
      cleanupHandlers.forEach((c) => c());
    };
  }, [showLandingGate]);

  return (
    <>
      {/* =====================================================================
          FULL-VIEWPORT LANDING PAGE STAGE (Matches image_f869bfaf.png)
          - Interactive 3D Glass Stone in center:
            * Clicking on the Glass Stone (or anywhere on stage by mistake/intentionally)
              breaks/shatters the Glass Stone into 36+ 3D glass shards!
            * Hovering over the Glass Stone automatically recovers/heals it!
          - Slow stroke-by-stroke calligraphic signature of "Sachin"
          - Clicking [ CLICK TO EXPLORE ] opens the website with 3D animation
         ===================================================================== */}
      {showLandingGate && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Sites for waking. Worlds for dreaming. Click anywhere to enter website"
          onClick={() => openWebsiteWithAnimation(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openWebsiteWithAnimation(true);
            }
          }}
          className="preloader-screen fixed inset-0 z-30 flex flex-col justify-between pt-16 sm:pt-24 pb-20 sm:pb-14 select-none cursor-pointer overflow-hidden bg-transparent"
          style={{ willChange: 'opacity' }}
        >
          {/* Top Metadata Micro-Row */}
          <div className="landing-top-row max-w-6xl w-full mx-auto px-4 sm:px-8 flex items-center justify-between gap-2 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.16em] sm:tracking-[0.22em] text-neutral-400 dark:text-neutral-400 light:text-neutral-600 pt-2">
            <span>PORTFOLIO V2 · SACHIN</span>
            <span>INTERACTIVE 3D · CLICK TO EXPLORE</span>
          </div>

          {/* Center Stage: Slow Stroke-by-Stroke "Sachin" Signature + Giant Gliding Headline */}
          <div
            className="landing-kinetic-stage relative w-full overflow-hidden my-auto py-4 sm:py-6 flex flex-col items-center justify-center"
            style={{ perspective: '1200px' }}
          >
            {/* Calligraphic Stroke-by-Stroke Signature of "Sachin" (No buttons!) */}
            <div className="relative z-20 pointer-events-none mb-2">
              <SachinSignature
                replayKey={sigReplayKey}
                isShattered={isStoneShattered}
              />
            </div>

            {/* Giant Horizontal Gliding Kinetic Headline Behind/Across the Glass Stone */}
            <div
              ref={landingTrackRef}
              className="flex items-baseline whitespace-nowrap gap-12 will-change-transform"
            >
              <div className="text-[14vw] sm:text-[12vw] font-bold tracking-[-0.045em] leading-[0.88] text-neutral-100 dark:text-neutral-100 light:text-[#141413]">
                <span className="hover-word">Sites</span>{' '}
                <span className="hover-word">for</span>{' '}
                <span className="hover-word">waking.</span>{' '}
                <span className="hover-word">Worlds</span>{' '}
                <span className="hover-word">for</span>{' '}
                <span className="hover-word">dreaming.</span>{' '}
                <span className="font-serif italic font-normal text-amber-500 dark:text-amber-400 light:text-[#141413] hover-word">
                  Sachin
                </span>{' '}
                — <span className="hover-word">Full-Stack</span> &amp;{' '}
                <span className="hover-word">AI.</span>
              </div>
              <span
                aria-hidden="true"
                className="text-[14vw] sm:text-[12vw] font-bold tracking-[-0.045em] leading-[0.88] text-neutral-100 dark:text-neutral-100 light:text-[#141413]"
              >
                Sites for waking. Worlds for dreaming.
              </span>
            </div>
          </div>

          {/* Bottom 4-Column Architectural Strip (matches image_f869bfaf.png with clean unboxed text) */}
          <div className="landing-bottom-row max-w-6xl w-full mx-auto px-4 sm:px-8 grid grid-cols-2 md:grid-cols-4 items-end gap-3 sm:gap-4 pt-2 sm:pt-4 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.14em] sm:tracking-[0.18em]">
            <div className="text-neutral-200 dark:text-neutral-200 light:text-[#141413] font-semibold leading-relaxed">
              <div>FULL-STACK &amp; AI DEVELOPER —</div>
              <div>DELHI</div>
            </div>

            <div className="text-neutral-400 dark:text-neutral-400 light:text-neutral-600 leading-relaxed">
              <div>WEB · MOTION · AI / ML</div>
              <div>PYTHON · REACT · 3D / UI</div>
            </div>

            <div className="flex items-center md:justify-end gap-2.5 text-neutral-200 dark:text-neutral-200 light:text-[#141413] group">
              <span className="w-4 h-6 rounded-full border border-current flex items-start justify-center p-1 group-hover:border-amber-400 transition-colors">
                <span className="w-0.5 h-1.5 bg-amber-400 rounded-full" />
              </span>
              <span className="group-hover:text-amber-400 transition-colors font-semibold">
                CLICK TO EXPLORE
              </span>
            </div>

            <div
              className="flex items-center justify-end gap-4 text-neutral-200 dark:text-neutral-200 light:text-[#141413] font-semibold"
              onClick={(e) => e.stopPropagation()}
            >
              <a
                href={PERSONAL_INFO.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => soundEngine.playHover()}
                className="hover:text-amber-500 transition-colors inline-flex items-center gap-0.5"
              >
                <span>GH</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
              <a
                href={PERSONAL_INFO.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => soundEngine.playHover()}
                className="hover:text-amber-500 transition-colors inline-flex items-center gap-0.5"
              >
                <span>IN</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
              <a
                href={PERSONAL_INFO.xUrl}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => soundEngine.playHover()}
                className="hover:text-amber-500 transition-colors inline-flex items-center gap-0.5"
              >
                <span>X</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* GSAP Custom Magnetic Cursor */}
      <div
        id="gsap-cursor"
        className="pointer-events-none fixed top-0 left-0 z-50 -ml-3 -mt-3 w-6 h-6 rounded-full border border-purple-500/80 mix-blend-difference transition-[width,height,margin,background] duration-200 hidden md:block"
        style={{ willChange: 'transform' }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      <style>{`
        #gsap-cursor.cursor-hover {
          width: 48px;
          height: 48px;
          margin-left: -24px;
          margin-top: -24px;
          background: rgba(185, 140, 255, 0.18);
          border-color: rgba(245, 158, 11, 0.95);
        }
      `}</style>
    </>
  );
};
