export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export type ShardTint = 'cobalt' | 'amber' | 'cyan' | 'silver' | 'violet';

export interface ShardPiecePhysics {
  id: number;
  indices: [number, number, number];
  tintType: ShardTint;
  /** Local centroid on the unit crystal (for computing radial blast direction) */
  localCentroid: Vec3;
  /** Thickness of the 3D extruded glass wedge */
  thickness: number;
  /** Current 3D world offset from the stone's rest position (in stone-radius units) */
  offset: Vec3;
  /** Current 3D linear velocity (stone-radius units / sec) */
  velocity: Vec3;
  /** Current 3D Euler rotation offset of the individual piece (radians) */
  rotation: Vec3;
  /** Current 3D angular velocity (radians / sec) */
  angularVelocity: Vec3;
  /** Individual chunk scale factor (shrinks slightly on fracture so distinct pieces separate cleanly) */
  scale: number;
  /** Target chunk scale when shattered */
  shatteredScale: number;
  /** Seed for curl-noise turbulence drift */
  turbulenceSeed: number;
}

export interface MicroSplinterParticle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  rot: number;
  vRot: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  tint: ShardTint;
}

export interface GlassPhysicsSystemState {
  phase: 'intact' | 'drifting' | 'recovering';
  elapsedInPhase: number;
  pieces: ShardPiecePhysics[];
  splinters: MicroSplinterParticle[];
  /** Normalized overall separation metric (0 = intact, >0 = shattered/drifting) */
  dispersionMetric: number;
}

/**
 * Creates the initial physics state for all 36 3D crystal pieces.
 */
export function createGlassPhysicsSystem(
  vertices: Vec3[],
  rawFaces: [number, number, number][]
): GlassPhysicsSystemState {
  const tints: ShardTint[] = ['silver', 'cobalt', 'amber', 'cyan', 'silver', 'violet'];

  const pieces: ShardPiecePhysics[] = rawFaces.map((indices, i) => {
    const v0 = vertices[indices[0]];
    const v1 = vertices[indices[1]];
    const v2 = vertices[indices[2]];
    const cx = (v0.x + v1.x + v2.x) / 3;
    const cy = (v0.y + v1.y + v2.y) / 3;
    const cz = (v0.z + v1.z + v2.z) / 3;

    return {
      id: i,
      indices,
      tintType: tints[i % tints.length],
      localCentroid: { x: cx, y: cy, z: cz },
      thickness: 0.24 + ((i * 7) % 5) * 0.05,
      offset: { x: 0, y: 0, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      angularVelocity: { x: 0, y: 0, z: 0 },
      scale: 1,
      shatteredScale: 0.48 + ((i * 13) % 7) * 0.055,
      turbulenceSeed: i * 1.37 + 0.5,
    };
  });

  return {
    phase: 'intact',
    elapsedInPhase: 0,
    pieces,
    splinters: [],
    dispersionMetric: 0,
  };
}

/**
 * Triggers an explosive 3D shatter impulse on all pieces and spawns fine glass splinters.
 * @param state Physics system state to mutate
 * @param impactNormX Normalized cursor impact X relative to stone center (-1..1)
 * @param impactNormY Normalized cursor impact Y relative to stone center (-1..1)
 */
export function triggerShatterImpulse(
  state: GlassPhysicsSystemState,
  impactNormX = 0,
  impactNormY = 0
): void {
  state.phase = 'drifting';
  state.elapsedInPhase = 0;

  const tints: ShardTint[] = ['silver', 'cobalt', 'amber', 'cyan', 'violet'];

  for (let i = 0; i < state.pieces.length; i++) {
    const p = state.pieces[i];
    const hash1 = Math.sin(p.turbulenceSeed * 12.9898 + i * 78.233) * 43758.5453;
    const rand1 = hash1 - Math.floor(hash1);
    const hash2 = Math.cos(p.turbulenceSeed * 45.164 + i * 19.13) * 23421.631;
    const rand2 = hash2 - Math.floor(hash2);
    const hash3 = Math.sin(p.turbulenceSeed * 91.7 + i * 37.2) * 15973.31;
    const rand3 = hash3 - Math.floor(hash3);

    const len = Math.hypot(p.localCentroid.x, p.localCentroid.y, p.localCentroid.z) || 1;
    const dirX = p.localCentroid.x / len;
    const dirY = p.localCentroid.y / len;
    const dirZ = p.localCentroid.z / len;

    // Pieces closer to the cursor impact point get an extra kinetic shockwave push
    const dxImpact = dirX - impactNormX * 0.5;
    const dyImpact = dirY - impactNormY * 0.5;
    const impactDist = Math.hypot(dxImpact, dyImpact);
    const shockBoost = Math.max(0.95, 1.9 - impactDist * 0.45);

    // Distinct radial tiers so inner, mid, and outer chunks drift at varied speeds across 3D space
    const tierMultiplier = 0.85 + (i % 4) * 0.38;
    const speed = (2.15 + rand1 * 1.95) * shockBoost * tierMultiplier;

    // Tangential swirl so pieces spread across all angles in 3D space
    const tangentX = -dirY * (0.35 + (rand2 - 0.5) * 0.65);
    const tangentY = dirX * (0.35 + (rand3 - 0.5) * 0.65);

    p.velocity = {
      x: (dirX * 1.15 + tangentX + (rand1 - 0.5) * 0.45) * speed,
      y: (dirY * 1.15 + tangentY + (rand2 - 0.5) * 0.45 - 0.18) * speed,
      z: (dirZ + (rand3 - 0.5) * 0.95) * speed * 0.85,
    };

    // Immediate fracture separation on frame 1 so chunks visibly crack apart right away
    p.offset = {
      x: p.velocity.x * 0.085,
      y: p.velocity.y * 0.085,
      z: p.velocity.z * 0.085,
    };
    p.scale = p.shatteredScale;

    // Distinct 3D tumbling angular velocity on all 3 axes
    p.angularVelocity = {
      x: (rand1 - 0.5) * 8.5 + (i % 2 === 0 ? 2.6 : -2.6),
      y: (rand2 - 0.5) * 9.0 + (i % 3 === 0 ? -2.8 : 2.8),
      z: (rand3 - 0.5) * 7.5,
    };
  }

  // Spawn 84 fine glass micro-splinters that burst from the fracture seams and fall with gravity
  const newSplinters: MicroSplinterParticle[] = [];
  const count = 84;
  for (let i = 0; i < count; i++) {
    const theta = (i / count) * Math.PI * 2 + (i % 7) * 0.19;
    const phi = (((i * 29) % 100) / 100) * Math.PI - Math.PI / 2;
    const spd = 1.8 + (((i * 17) % 100) / 100) * 3.4;

    newSplinters.push({
      x: Math.cos(theta) * Math.cos(phi) * 0.4,
      y: Math.sin(phi) * 0.4,
      z: Math.sin(theta) * Math.cos(phi) * 0.4,
      vx: Math.cos(theta) * Math.cos(phi) * spd,
      vy: Math.sin(phi) * spd - 0.55,
      vz: Math.sin(theta) * Math.cos(phi) * spd,
      rot: i * 0.4,
      vRot: (i % 2 === 0 ? 1 : -1) * (5.5 + (i % 9) * 1.5),
      size: 2.4 + (i % 5) * 1.85,
      alpha: 1.0,
      life: 0,
      maxLife: 1.55 + (i % 6) * 0.25,
      tint: tints[i % tints.length],
    });
  }
  state.splinters = newSplinters;
  state.dispersionMetric = 0.25;
}

/**
 * Transitions the shattered pieces into magnetic self-recovery mode.
 */
export function startRecoveryPhase(state: GlassPhysicsSystemState): void {
  if (state.phase === 'intact') return;
  state.phase = 'recovering';
  state.elapsedInPhase = 0;
}

/**
 * Advances the 3D particle physics simulation by dt seconds.
 */
export function stepGlassPhysics(state: GlassPhysicsSystemState, dt: number): void {
  const safeDt = Math.min(0.05, Math.max(0.001, dt));
  state.elapsedInPhase += safeDt;

  if (state.phase === 'intact') {
    state.dispersionMetric = 0;
    return;
  }

  let totalDist = 0;

  if (state.phase === 'drifting') {
    // Low drag so the 36 3D pieces travel far apart and keep drifting through 3D space
    const drag = Math.pow(0.54, safeDt);
    const t = state.elapsedInPhase;

    for (let i = 0; i < state.pieces.length; i++) {
      const p = state.pieces[i];

      // Smoothly transition chunk scale to shatteredScale so clear space opens between pieces
      p.scale += (p.shatteredScale - p.scale) * Math.min(1, safeDt * 14);

      // 3D curl-noise drift + subtle downward gravity
      const curlX = Math.sin(t * 2.2 + p.turbulenceSeed) * 0.55;
      const curlY = Math.cos(t * 1.9 + p.turbulenceSeed * 1.3) * 0.45 + 0.34;
      const curlZ = Math.sin(t * 1.7 + p.turbulenceSeed * 0.7) * 0.48;

      const len = Math.hypot(p.localCentroid.x, p.localCentroid.y, p.localCentroid.z) || 1;
      const outwardDrift = 0.62;

      p.velocity.x =
        p.velocity.x * drag + (curlX + (p.localCentroid.x / len) * outwardDrift) * safeDt;
      p.velocity.y =
        p.velocity.y * drag + (curlY + (p.localCentroid.y / len) * outwardDrift) * safeDt;
      p.velocity.z =
        p.velocity.z * drag + (curlZ + (p.localCentroid.z / len) * outwardDrift) * safeDt;

      p.offset.x += p.velocity.x * safeDt;
      p.offset.y += p.velocity.y * safeDt;
      p.offset.z += p.velocity.z * safeDt;

      const angDrag = Math.pow(0.65, safeDt);
      p.angularVelocity.x *= angDrag;
      p.angularVelocity.y *= angDrag;
      p.angularVelocity.z *= angDrag;

      p.rotation.x += p.angularVelocity.x * safeDt;
      p.rotation.y += p.angularVelocity.y * safeDt;
      p.rotation.z += p.angularVelocity.z * safeDt;

      const d = Math.hypot(p.offset.x, p.offset.y, p.offset.z);
      totalDist += d;
    }
  } else if (state.phase === 'recovering') {
    const springK = 16.0 + state.elapsedInPhase * 24.0;
    const damping = Math.pow(0.015, safeDt);

    for (let i = 0; i < state.pieces.length; i++) {
      const p = state.pieces[i];

      const ax = -p.offset.x * springK;
      const ay = -p.offset.y * springK;
      const az = -p.offset.z * springK;

      p.velocity.x = (p.velocity.x + ax * safeDt) * damping;
      p.velocity.y = (p.velocity.y + ay * safeDt) * damping;
      p.velocity.z = (p.velocity.z + az * safeDt) * damping;

      p.offset.x += p.velocity.x * safeDt;
      p.offset.y += p.velocity.y * safeDt;
      p.offset.z += p.velocity.z * safeDt;

      // Restore chunk scale back to 1.0 as it locks into the crystal
      p.scale += (1.0 - p.scale) * Math.min(1, safeDt * 9.5);

      const rotDecay = Math.pow(0.003, safeDt);
      p.rotation.x *= rotDecay;
      p.rotation.y *= rotDecay;
      p.rotation.z *= rotDecay;
      p.angularVelocity.x *= rotDecay;
      p.angularVelocity.y *= rotDecay;
      p.angularVelocity.z *= rotDecay;

      const d = Math.hypot(p.offset.x, p.offset.y, p.offset.z);
      totalDist += d;
    }

    const avgDist = totalDist / Math.max(1, state.pieces.length);
    if (avgDist < 0.015 || state.elapsedInPhase > 1.2) {
      for (const p of state.pieces) {
        p.offset.x = 0;
        p.offset.y = 0;
        p.offset.z = 0;
        p.velocity.x = 0;
        p.velocity.y = 0;
        p.velocity.z = 0;
        p.rotation.x = 0;
        p.rotation.y = 0;
        p.rotation.z = 0;
        p.scale = 1;
      }
      state.phase = 'intact';
      state.splinters = [];
      state.dispersionMetric = 0;
      return;
    }
  }

  for (let i = state.splinters.length - 1; i >= 0; i--) {
    const s = state.splinters[i];
    s.life += safeDt;
    if (s.life >= s.maxLife) {
      state.splinters.splice(i, 1);
      continue;
    }
    if (state.phase === 'recovering') {
      s.vx = (s.vx - s.x * 16 * safeDt) * 0.88;
      s.vy = (s.vy - s.y * 16 * safeDt) * 0.88;
      s.vz = (s.vz - s.z * 16 * safeDt) * 0.88;
    } else {
      const sDrag = Math.pow(0.45, safeDt);
      s.vx *= sDrag;
      s.vy = s.vy * sDrag + 1.25 * safeDt;
      s.vz *= sDrag;
    }
    s.x += s.vx * safeDt;
    s.y += s.vy * safeDt;
    s.z += s.vz * safeDt;
    s.rot += s.vRot * safeDt;
    s.alpha = Math.max(0, 1 - Math.pow(s.life / s.maxLife, 1.4));
  }

  const avgDist = totalDist / Math.max(1, state.pieces.length);
  state.dispersionMetric = Math.min(1, avgDist / 1.15);
}
