export interface CrystalChoreographyState {
  /** Normalized X position on viewport (0.0 = left, 0.5 = center, 1.0 = right) */
  normX: number;
  /** Normalized Y position on viewport (0.0 = top, 0.5 = center, 1.0 = bottom) */
  normY: number;
  /** Scale multiplier for the primary 3D crystal */
  scale: number;
  /** Shard dispersion factor (0 = unified crystal, 1 = scattered shards) */
  shardScatter: number;
  /** Electric purple portal ring intensity (0 = hidden, 1 = full singularity portal) */
  portalIntensity: number;
  /** Active section label for HUD/analytics */
  sectionPhase: 'hero' | 'about' | 'disciplines' | 'works' | 'dream-portal' | 'details' | 'contact';
}

export function clamp01(val: number): number {
  if (Number.isNaN(val)) return 0;
  return Math.max(0, Math.min(1, val));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp01(t);
}

/**
 * Computes the 3D crystal position, shard scatter, and portal ring intensity
 * across the scroll timeline to match the daikifujita.com video choreography.
 */
export function getCrystalChoreography(
  scrollProgress: number,
  isDark: boolean
): CrystalChoreographyState {
  const p = clamp01(scrollProgress);

  // 0.00 -> 0.12: Hero ("Sites for waking. Worlds for dreaming.")
  if (p < 0.12) {
    const t = p / 0.12;
    return {
      normX: lerp(0.5, 0.54, t),
      normY: lerp(0.49, 0.5, t),
      scale: lerp(1.05, 1.0, t),
      shardScatter: Math.sin(t * Math.PI) * 0.65,
      portalIntensity: isDark ? 0.45 : 0.08,
      sectionPhase: 'hero',
    };
  }

  // 0.12 -> 0.25: [01] ABOUT (Crystal moves to right column while left text focuses)
  if (p < 0.25) {
    const t = (p - 0.12) / 0.13;
    return {
      normX: lerp(0.54, 0.76, t),
      normY: lerp(0.5, 0.52, t),
      scale: lerp(1.0, 0.92, t),
      shardScatter: lerp(0.25, 0.05, t),
      portalIntensity: isDark ? 0.35 : 0.0,
      sectionPhase: 'about',
    };
  }

  // 0.25 -> 0.36: [02] DISCIPLINES (Crystal stays on right, subtle rotation)
  if (p < 0.36) {
    const t = (p - 0.25) / 0.11;
    return {
      normX: lerp(0.76, 0.78, t),
      normY: lerp(0.52, 0.54, t),
      scale: lerp(0.92, 0.86, t),
      shardScatter: lerp(0.05, 0.35, t),
      portalIntensity: isDark ? 0.3 : 0.0,
      sectionPhase: 'disciplines',
    };
  }

  // 0.36 -> 0.56: [03] SELECTED WORKS (Horizontal gallery, shards scatter in parallax)
  if (p < 0.56) {
    const t = (p - 0.36) / 0.2;
    return {
      normX: lerp(0.78, 0.35, t),
      normY: lerp(0.54, 0.46, t),
      scale: lerp(0.86, 0.78, t),
      shardScatter: 0.75,
      portalIntensity: isDark ? 0.25 : 0.0,
      sectionPhase: 'works',
    };
  }

  // 0.56 -> 0.70: [04] DREAM MODE ("There is another way ... to see this archive.")
  if (p < 0.7) {
    const t = (p - 0.56) / 0.14;
    const bell = Math.sin(t * Math.PI);
    return {
      normX: lerp(0.35, 0.5, Math.min(1, t * 2)),
      normY: 0.5,
      scale: lerp(0.78, 0.95, bell),
      shardScatter: 0.85,
      portalIntensity: Math.max(isDark ? 0.85 : 0.6, bell),
      sectionPhase: 'dream-portal',
    };
  }

  // 0.70 -> 0.86: Activity, Stack & Academic Archive
  if (p < 0.86) {
    const t = (p - 0.7) / 0.16;
    return {
      normX: lerp(0.5, 0.82, t),
      normY: lerp(0.5, 0.48, t),
      scale: 0.72,
      shardScatter: 0.3,
      portalIntensity: isDark ? 0.3 : 0.0,
      sectionPhase: 'details',
    };
  }

  // 0.86 -> 1.00: SAY HELLO. (Crystal on right-center with orbiting "SAY HELLO" ring)
  const t = (p - 0.86) / 0.14;
  return {
    normX: lerp(0.82, 0.72, t),
    normY: lerp(0.48, 0.46, t),
    scale: lerp(0.72, 0.96, t),
    shardScatter: lerp(0.3, 0.12, t),
    portalIntensity: isDark ? 0.45 : 0.05,
    sectionPhase: 'contact',
  };
}

/**
 * Formats the Selected Works counter in Daiki Fujita style ("01 / 06")
 */
export function formatWorksCounter(currentIndexZeroBased: number, totalCount: number): string {
  const safeTotal = Math.max(1, totalCount);
  const clampedCurrent = Math.max(1, Math.min(safeTotal, currentIndexZeroBased + 1));
  return `${String(clampedCurrent).padStart(2, '0')} / ${String(safeTotal).padStart(2, '0')}`;
}

/**
 * Computes progressive gaussian blur (in px) and opacity for scroll-focus typography
 * seen in [01] ABOUT, [02] DISCIPLINES, and SAY HELLO.
 */
export function computeFocusBlur(normalizedDistanceFromFocus: number): {
  blurPx: number;
  opacity: number;
} {
  const dist = clamp01(Math.abs(normalizedDistanceFromFocus));
  const blurPx = Math.round(dist * 10 * 10) / 10;
  const opacity = Math.round(lerp(1, 0.28, dist) * 100) / 100;
  return { blurPx, opacity };
}
