export interface SectionRevealVars {
  from: {
    opacity: number;
    y: number;
    scale: number;
  };
  to: {
    opacity: number;
    y: number;
    scale: number;
    duration: number;
    ease: string;
  };
  triggerStart: string;
  triggerEnd: string;
  toggleActions: string;
  fastScrollEnd: boolean;
}

export interface StaggerRevealVars {
  from: {
    opacity: number;
    y: number;
    scale: number;
  };
  to: {
    opacity: number;
    y: number;
    scale: number;
    duration: number;
    stagger: number;
    ease: string;
  };
  triggerStart: string;
  toggleActions: string;
  fastScrollEnd: boolean;
}

/**
 * Returns the GSAP ScrollTrigger from/to animation configuration for top-level
 * portfolio sections (.depth-section) so they fade in and slide up gracefully.
 */
export function getSectionScrollRevealConfig(prefersReducedMotion = false): SectionRevealVars {
  if (prefersReducedMotion) {
    return {
      from: { opacity: 1, y: 0, scale: 1 },
      to: { opacity: 1, y: 0, scale: 1, duration: 0, ease: 'none' },
      triggerStart: 'top 95%',
      triggerEnd: 'bottom 5%',
      toggleActions: 'none none none none',
      fastScrollEnd: true,
    };
  }

  return {
    from: {
      opacity: 0,
      y: 56,
      scale: 0.985,
    },
    to: {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.85,
      ease: 'power3.out',
    },
    triggerStart: 'top 86%',
    triggerEnd: 'bottom 12%',
    toggleActions: 'play none none reverse',
    fastScrollEnd: true,
  };
}

/**
 * Returns the GSAP ScrollTrigger configuration for staggered child card grids
 * (.gsap-stagger-grid > .gsap-stagger-item) inside portfolio sections.
 */
export function getStaggerBatchConfig(
  itemCount: number,
  prefersReducedMotion = false
): StaggerRevealVars {
  const safeCount = Math.max(1, itemCount);
  if (prefersReducedMotion) {
    return {
      from: { opacity: 1, y: 0, scale: 1 },
      to: { opacity: 1, y: 0, scale: 1, duration: 0, stagger: 0, ease: 'none' },
      triggerStart: 'top 95%',
      toggleActions: 'none none none none',
      fastScrollEnd: true,
    };
  }

  // Keep total stagger cascade brisk even for larger grids (e.g., 6 cards)
  const staggerStep = safeCount > 4 ? 0.075 : 0.1;

  return {
    from: {
      opacity: 0,
      y: 36,
      scale: 0.975,
    },
    to: {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.72,
      stagger: staggerStep,
      ease: 'power3.out',
    },
    triggerStart: 'top 88%',
    toggleActions: 'play none none reverse',
    fastScrollEnd: true,
  };
}

/**
 * Returns the GSAP ScrollTrigger configuration for staggered section titles
 * (kicker, main heading, subtitle/paragraph) so they slide up gracefully in sequence.
 */
export function getTitleStaggerConfig(prefersReducedMotion = false) {
  if (prefersReducedMotion) {
    return {
      from: { opacity: 1, y: 0, rotateX: 0 },
      to: { opacity: 1, y: 0, rotateX: 0, duration: 0, stagger: 0, ease: 'none' },
      triggerStart: 'top 90%',
      toggleActions: 'none none none none',
      fastScrollEnd: true,
    };
  }

  return {
    from: {
      opacity: 0,
      y: 32,
      rotateX: -6,
    },
    to: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 0.76,
      stagger: 0.09,
      ease: 'power3.out',
    },
    triggerStart: 'top 90%',
    toggleActions: 'play none none reverse',
    fastScrollEnd: true,
  };
}

/**
 * Returns the GSAP ScrollTrigger configuration for interior content blocks
 * and cards so they slide up with a staggered cadence.
 */
export function getContentBlockStaggerConfig(prefersReducedMotion = false) {
  if (prefersReducedMotion) {
    return {
      from: { opacity: 1, y: 0, scale: 1 },
      to: { opacity: 1, y: 0, scale: 1, duration: 0, stagger: 0, ease: 'none' },
      triggerStart: 'top 90%',
      toggleActions: 'none none none none',
      fastScrollEnd: true,
    };
  }

  return {
    from: {
      opacity: 0,
      y: 34,
      scale: 0.98,
    },
    to: {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.75,
      stagger: 0.08,
      ease: 'power3.out',
    },
    triggerStart: 'top 89%',
    toggleActions: 'play none none reverse',
    fastScrollEnd: true,
  };
}

/**
 * Pure helper to compute normalized reveal progress (0 to 1) of a section
 * based on its bounding rect top relative to the viewport height.
 */
export function computeSectionRevealProgress(
  elementTop: number,
  viewportHeight: number,
  startRatio = 0.86,
  endRatio = 0.35
): number {
  if (viewportHeight <= 0) return 1;
  const startY = viewportHeight * startRatio;
  const endY = viewportHeight * endRatio;
  if (startY <= endY) return elementTop <= endY ? 1 : 0;

  const raw = (startY - elementTop) / (startY - endY);
  return Math.max(0, Math.min(1, Number(raw.toFixed(4))));
}
