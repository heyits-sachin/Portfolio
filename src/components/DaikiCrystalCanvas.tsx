import React, { useEffect, useRef } from 'react';
import { getCrystalChoreography, lerp } from '../utils/daikiSceneLogic';
import {
  createGlassPhysicsSystem,
  triggerShatterImpulse,
  startRecoveryPhase,
  stepGlassPhysics,
  Vec3,
  ShardTint,
} from '../utils/glassStonePhysics';
import { soundEngine } from '../utils/soundEngine';

interface DaikiCrystalCanvasProps {
  isDark: boolean;
}

interface BlobPoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  life: number;
  maxLife: number;
}

interface ImpactWave {
  x: number;
  y: number;
  r: number;
  alpha: number;
}

declare global {
  interface Window {
    __glassStoneDebug?: {
      phase: 'intact' | 'drifting' | 'recovering';
      dispersionMetric: number;
      shatterCount: number;
      avgPieceDriftPx: number;
    };
  }
}

// Build a sculpted irregular 3D refractive glass stone (36 triangular facets)
function createCrystalRockGeometry(): {
  vertices: Vec3[];
  rawFaces: [number, number, number][];
} {
  const vertices: Vec3[] = [
    { x: 0.0, y: -1.28, z: 0.05 }, // 0: Top peak
    // Upper crown ring (1..6)
    { x: 0.68, y: -0.78, z: 0.52 },
    { x: 0.85, y: -0.68, z: -0.35 },
    { x: 0.12, y: -0.82, z: -0.82 },
    { x: -0.72, y: -0.74, z: -0.48 },
    { x: -0.88, y: -0.62, z: 0.36 },
    { x: -0.15, y: -0.75, z: 0.86 },
    // Mid belly ring (7..12)
    { x: 0.96, y: 0.05, z: 0.42 },
    { x: 0.78, y: 0.18, z: -0.68 },
    { x: -0.12, y: 0.12, z: -0.95 },
    { x: -0.92, y: 0.08, z: -0.38 },
    { x: -0.84, y: 0.22, z: 0.64 },
    { x: 0.24, y: 0.15, z: 0.98 },
    // Lower base ring (13..18)
    { x: 0.58, y: 0.82, z: 0.46 },
    { x: 0.62, y: 0.76, z: -0.42 },
    { x: -0.05, y: 0.86, z: -0.68 },
    { x: -0.64, y: 0.78, z: -0.25 },
    { x: -0.52, y: 0.85, z: 0.52 },
    { x: 0.12, y: 0.88, z: 0.68 },
    // Bottom point (19)
    { x: 0.04, y: 1.24, z: -0.04 },
  ];

  const rawFaces: [number, number, number][] = [
    // Top cap
    [0, 1, 2],
    [0, 2, 3],
    [0, 3, 4],
    [0, 4, 5],
    [0, 5, 6],
    [0, 6, 1],
    // Upper to Mid belt
    [1, 7, 2],
    [2, 7, 8],
    [2, 8, 3],
    [3, 8, 9],
    [3, 9, 4],
    [4, 9, 10],
    [4, 10, 5],
    [5, 10, 11],
    [5, 11, 6],
    [6, 11, 12],
    [6, 12, 1],
    [1, 12, 7],
    // Mid to Lower belt
    [7, 13, 8],
    [8, 13, 14],
    [8, 14, 9],
    [9, 14, 15],
    [9, 15, 10],
    [10, 15, 16],
    [10, 16, 11],
    [11, 16, 17],
    [11, 17, 12],
    [12, 17, 18],
    [12, 18, 7],
    [7, 18, 13],
    // Bottom cap
    [19, 14, 13],
    [19, 15, 14],
    [19, 16, 15],
    [19, 17, 16],
    [19, 18, 17],
    [19, 13, 18],
  ];

  return { vertices, rawFaces };
}

function rotatePoint(v: Vec3, rx: number, ry: number, rz: number): Vec3 {
  const cosX = Math.cos(rx);
  const sinX = Math.sin(rx);
  const y1 = v.y * cosX - v.z * sinX;
  const z1 = v.y * sinX + v.z * cosX;

  const cosY = Math.cos(ry);
  const sinY = Math.sin(ry);
  const x2 = v.x * cosY + z1 * sinY;
  const z2 = -v.x * sinY + z1 * cosY;

  const cosZ = Math.cos(rz);
  const sinZ = Math.sin(rz);
  const x3 = x2 * cosZ - y1 * sinZ;
  const y3 = x2 * sinZ + y1 * cosZ;

  return { x: x3, y: y3, z: z2 };
}

export const DaikiCrystalCanvas: React.FC<DaikiCrystalCanvasProps> = ({ isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDarkRef = useRef(isDark);

  useEffect(() => {
    isDarkRef.current = isDark;
  }, [isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { vertices, rawFaces } = createCrystalRockGeometry();
    const physicsState = createGlassPhysicsSystem(vertices, rawFaces);

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const pointer = {
      x: width * 0.42,
      y: height * 0.52,
      targetX: width * 0.42,
      targetY: height * 0.52,
      prevX: width * 0.42,
      prevY: height * 0.52,
      active: false,
      lastMoveTime: performance.now(),
    };

    const blobs: BlobPoint[] = [
      { x: width * 0.43, y: height * 0.54, vx: -0.4, vy: 0.2, radius: 44, life: 0.15, maxLife: 1.0 },
      { x: width * 0.39, y: height * 0.57, vx: -0.3, vy: 0.15, radius: 34, life: 0.3, maxLife: 1.0 },
      { x: width * 0.36, y: height * 0.59, vx: -0.2, vy: 0.1, radius: 24, life: 0.45, maxLife: 1.0 },
    ];

    const impactWaves: ImpactWave[] = [];

    const timingState = {
      shatterTimestamp: 0,
      lastRecoverTimestamp: 0,
      autoRecoverTimer: 0,
    };

    const smoothState = {
      x: width * 0.5,
      y: height * 0.49,
      scale: 1.0,
      scatter: 0.25,
      portal: 0.1,
      rotX: 0.2,
      rotY: 0.4,
      rotZ: -0.1,
    };

    const triggerGlassRecover = () => {
      if (physicsState.phase !== 'drifting') return;
      startRecoveryPhase(physicsState);
      timingState.lastRecoverTimestamp = performance.now();
      window.clearTimeout(timingState.autoRecoverTimer);
      soundEngine.playGlassRecover();
      window.dispatchEvent(
        new CustomEvent('glass-stone-state', { detail: { shattered: false } })
      );
    };

    const triggerGlassShatter = (originX?: number, originY?: number) => {
      const now = performance.now();
      if (physicsState.phase === 'drifting' && now - timingState.shatterTimestamp < 600) return;

      timingState.shatterTimestamp = now;
      const baseR = Math.max(80, Math.min(width, height) * 0.185);
      const impactNormX = originX !== undefined ? (originX - smoothState.x) / baseR : 0;
      const impactNormY = originY !== undefined ? (originY - smoothState.y) / baseR : 0;

      // Impart 3D particle physics impulse to all 36 3D pieces + spawn 72 micro-splinters
      triggerShatterImpulse(physicsState, impactNormX, impactNormY);
      soundEngine.playGlassShatter();

      impactWaves.push({
        x: originX ?? smoothState.x,
        y: originY ?? smoothState.y,
        r: 14,
        alpha: 0.95,
      });
      impactWaves.push({
        x: smoothState.x,
        y: smoothState.y,
        r: 28,
        alpha: 0.65,
      });

      window.dispatchEvent(
        new CustomEvent('glass-stone-state', { detail: { shattered: true } })
      );

      // Let the 36 3D pieces drift away in space for 2.15 seconds before magnetic recovery begins
      window.clearTimeout(timingState.autoRecoverTimer);
      timingState.autoRecoverTimer = window.setTimeout(() => {
        triggerGlassRecover();
      }, 2150);
    };

    const handleCustomShatter = () => triggerGlassShatter();
    const handleCustomRecover = () => triggerGlassRecover();
    window.addEventListener('glass-stone-shatter', handleCustomShatter);
    window.addEventListener('glass-stone-recover', handleCustomRecover);

    const handleMouseMove = (e: MouseEvent) => {
      pointer.targetX = e.clientX;
      pointer.targetY = e.clientY;
      pointer.active = true;
      pointer.lastMoveTime = performance.now();

      // Automatically shatter the Glass Stone with 3D particle physics when hovering over it
      const distToStone = Math.hypot(e.clientX - smoothState.x, e.clientY - smoothState.y);
      const stoneRadius = Math.min(width, height) * 0.22;
      const now = performance.now();

      if (distToStone < stoneRadius) {
        if (physicsState.phase === 'intact' && now - timingState.lastRecoverTimestamp > 550) {
          triggerGlassShatter(e.clientX, e.clientY);
        }
      }

      const dx = e.clientX - pointer.prevX;
      const dy = e.clientY - pointer.prevY;
      const dist = Math.hypot(dx, dy);

      if (dist > 8) {
        pointer.prevX = e.clientX;
        pointer.prevY = e.clientY;
        blobs.push({
          x: e.clientX,
          y: e.clientY,
          vx: dx * 0.04,
          vy: dy * 0.04,
          radius: Math.min(54, 24 + dist * 0.45),
          life: 0,
          maxLife: 1.0,
        });
        if (blobs.length > 26) blobs.shift();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches || e.touches.length === 0) return;
      const touch = e.touches[0];
      handleMouseMove({
        clientX: touch.clientX,
        clientY: touch.clientY,
      } as MouseEvent);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchstart', handleTouchMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    const shards = [
      { angle: 0.3, dist: 165, yOff: -95, size: 42, speed: 0.4 },
      { angle: 1.4, dist: 195, yOff: 85, size: 52, speed: -0.35 },
      { angle: 2.5, dist: 175, yOff: -75, size: 32, speed: 0.5 },
      { angle: 3.6, dist: 210, yOff: 60, size: 28, speed: -0.45 },
      { angle: 4.5, dist: 150, yOff: -120, size: 22, speed: 0.6 },
      { angle: 5.4, dist: 230, yOff: -30, size: 35, speed: -0.3 },
    ];

    const ringText = 'PORTFOLIO V2 · 2026 · SACHIN · 3D GLASS STONE · HOVER TO SHATTER · ';
    let time = 0;
    let lastFrameTime = performance.now();
    let timerId = 0;
    let animId = 0;

    const drawRingSlice = (
      cx: number,
      cy: number,
      rxRadius: number,
      ryRadius: number,
      tiltRad: number,
      timeAngle: number,
      frontHalf: boolean,
      darkTheme: boolean
    ) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(tiltRad);
      ctx.font = '600 9.5px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const len = ringText.length;
      for (let i = 0; i < len; i++) {
        const theta = (i / len) * Math.PI * 2 + timeAngle;
        const sinT = Math.sin(theta);
        const isFront = sinT >= 0;
        if (isFront !== frontHalf) continue;

        const x = Math.cos(theta) * rxRadius;
        const y = sinT * ryRadius;
        const depthAlpha = isFront
          ? 0.45 + 0.45 * sinT
          : 0.14 + 0.18 * (1 + sinT);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(theta + Math.PI / 2);
        ctx.fillStyle = darkTheme
          ? `rgba(232, 228, 255, ${depthAlpha})`
          : `rgba(20, 20, 19, ${depthAlpha})`;
        ctx.fillText(ringText[i], 0, 0);
        ctx.restore();
      }
      ctx.restore();
    };

    const render = () => {
      const now = performance.now();
      const rawDt = (now - lastFrameTime) / 1000;
      lastFrameTime = now;
      const dt = Math.min(0.045, Math.max(0.012, rawDt || 0.025));

      time += dt * 0.85;
      const darkTheme = isDarkRef.current;

      // Advance the 3D shard & splinter particle physics simulation
      stepGlassPhysics(physicsState, dt);
      const shatterDispersion = physicsState.dispersionMetric;

      // Calculate scroll progress (0..1)
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const scrollProgress = window.scrollY / maxScroll;
      const targetChoreo = getCrystalChoreography(scrollProgress, darkTheme);

      pointer.x = lerp(pointer.x, pointer.targetX, 0.18);
      pointer.y = lerp(pointer.y, pointer.targetY, 0.18);

      const targetX = width * targetChoreo.normX + (pointer.x - width * 0.5) * 0.06;
      const targetY = height * targetChoreo.normY + (pointer.y - height * 0.5) * 0.05;
      const hoverDist = Math.hypot(pointer.x - smoothState.x, pointer.y - smoothState.y);
      const hoverScatterBoost = hoverDist < 220 ? (1 - hoverDist / 220) * 0.45 : 0;
      const targetScatter = Math.min(
        1,
        targetChoreo.shardScatter + hoverScatterBoost + shatterDispersion * 0.75
      );

      smoothState.x = lerp(smoothState.x, targetX, 0.09);
      smoothState.y = lerp(smoothState.y, targetY, 0.09);
      smoothState.scale = lerp(smoothState.scale, targetChoreo.scale, 0.09);
      smoothState.scatter = lerp(smoothState.scatter, targetScatter, 0.09);
      smoothState.portal = lerp(
        smoothState.portal,
        Math.max(targetChoreo.portalIntensity, shatterDispersion * 0.9),
        0.09
      );

      smoothState.rotY =
        time * 0.45 + scrollProgress * Math.PI * 2.4 + (pointer.x / width - 0.5) * 0.8;
      smoothState.rotX = Math.sin(time * 0.35) * 0.25 + (pointer.y / height - 0.5) * 0.6;
      smoothState.rotZ = -0.15 + Math.cos(time * 0.25) * 0.12;

      ctx.clearRect(0, 0, width, height);

      // ========================================================================
      // 1. PURPLE LIQUID INK / METABALL CURSOR TRAIL
      // ========================================================================
      if (blobs.length > 0) {
        ctx.save();
        for (let i = blobs.length - 1; i >= 0; i--) {
          const b = blobs[i];
          b.x += b.vx;
          b.y += b.vy;
          b.vx *= 0.96;
          b.vy *= 0.96;
          b.life += pointer.active ? 0.025 : 0.002;
          if (b.life >= b.maxLife) {
            blobs.splice(i, 1);
            continue;
          }
          const lifeRatio = 1 - b.life / b.maxLife;
          const r = Math.max(2, b.radius * Math.pow(lifeRatio, 0.65));

          const grad = ctx.createRadialGradient(b.x, b.y, r * 0.15, b.x, b.y, r * 1.35);
          if (darkTheme) {
            grad.addColorStop(0, `rgba(139, 92, 246, ${0.42 * lifeRatio})`);
            grad.addColorStop(0.6, `rgba(88, 28, 135, ${0.28 * lifeRatio})`);
            grad.addColorStop(1, 'rgba(88, 28, 135, 0)');
          } else {
            grad.addColorStop(0, `rgba(46, 16, 101, ${0.92 * lifeRatio})`);
            grad.addColorStop(0.58, `rgba(76, 29, 149, ${0.82 * lifeRatio})`);
            grad.addColorStop(0.82, `rgba(124, 58, 237, ${0.45 * lifeRatio})`);
            grad.addColorStop(1, 'rgba(124, 58, 237, 0)');
          }
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(b.x, b.y, r * 1.35, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      const cx = smoothState.x;
      const cy = smoothState.y;
      const baseRadius = Math.min(width, height) * 0.185 * smoothState.scale;

      // ========================================================================
      // 2. ELECTRIC PURPLE DREAM PORTAL RING & SHATTER CORE SINGULARITY
      // ========================================================================
      if (smoothState.portal > 0.02 || smoothState.scatter > 0.3 || shatterDispersion > 0.04) {
        const portalAlpha = Math.max(
          smoothState.portal,
          smoothState.scatter * 0.65,
          shatterDispersion * 0.95
        );
        const portalR =
          baseRadius * (0.95 + smoothState.scatter * 0.25 + shatterDispersion * 0.35);

        ctx.save();
        const portalGrad = ctx.createRadialGradient(
          cx,
          cy,
          portalR * 0.06,
          cx,
          cy,
          portalR * 1.55
        );
        portalGrad.addColorStop(
          0,
          shatterDispersion > 0.15
            ? `rgba(245, 158, 11, ${0.45 * shatterDispersion})`
            : `rgba(18, 9, 43, ${0.88 * portalAlpha})`
        );
        portalGrad.addColorStop(0.52, `rgba(109, 40, 217, ${0.65 * portalAlpha})`);
        portalGrad.addColorStop(0.76, `rgba(192, 132, 252, ${0.52 * portalAlpha})`);
        portalGrad.addColorStop(1, 'rgba(139, 92, 246, 0)');

        ctx.fillStyle = portalGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, portalR * 1.55, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // ========================================================================
      // 3. ORBITING TEXT RING (BACK HALF)
      // ========================================================================
      drawRingSlice(
        cx,
        cy,
        baseRadius * (1.62 + shatterDispersion * 0.35),
        baseRadius * (0.56 + shatterDispersion * 0.12),
        -0.38,
        time * 0.55,
        false,
        darkTheme
      );

      // ========================================================================
      // 4. 3D VOLUMETRIC GLASS STONE PIECES WITH PARTICLE PHYSICS DRIFT
      // ========================================================================
      const isBroken = physicsState.phase !== 'intact' || shatterDispersion > 0.01;

      interface ProjectedPiece {
        id: number;
        frontPts: [{ x: number; y: number }, { x: number; y: number }, { x: number; y: number }];
        corePt: { x: number; y: number };
        centroidScreen: { x: number; y: number };
        avgZ: number;
        crossZ: number;
        nx: number;
        ny: number;
        nz: number;
        tintType: ShardTint;
        driftDist: number;
      }

      const projectedPieces: ProjectedPiece[] = [];
      let sumDriftPx = 0;

      for (const piece of physicsState.pieces) {
        const rawV0 = vertices[piece.indices[0]];
        const rawV1 = vertices[piece.indices[1]];
        const rawV2 = vertices[piece.indices[2]];

        // Local coordinates relative to the piece's own centroid, scaled by piece.scale
        // so when shattered, each piece forms a distinct, separated 3D crystal chunk
        const c = piece.localCentroid;
        const pScale = piece.scale;
        const loc0: Vec3 = {
          x: (rawV0.x - c.x) * pScale,
          y: (rawV0.y - c.y) * pScale,
          z: (rawV0.z - c.z) * pScale,
        };
        const loc1: Vec3 = {
          x: (rawV1.x - c.x) * pScale,
          y: (rawV1.y - c.y) * pScale,
          z: (rawV1.z - c.z) * pScale,
        };
        const loc2: Vec3 = {
          x: (rawV2.x - c.x) * pScale,
          y: (rawV2.y - c.y) * pScale,
          z: (rawV2.z - c.z) * pScale,
        };

        // Inner wedge apex (gives each broken shard real 3D volumetric thickness!)
        const cLen = Math.hypot(c.x, c.y, c.z) || 1;
        const locCore: Vec3 = {
          x: (-c.x / cLen) * piece.thickness * pScale,
          y: (-c.y / cLen) * piece.thickness * pScale,
          z: (-c.z / cLen) * piece.thickness * pScale,
        };

        // 1. Rotate piece around its own tumbling axes (when shattered/drifting)
        const tumb0 = isBroken
          ? rotatePoint(loc0, piece.rotation.x, piece.rotation.y, piece.rotation.z)
          : loc0;
        const tumb1 = isBroken
          ? rotatePoint(loc1, piece.rotation.x, piece.rotation.y, piece.rotation.z)
          : loc1;
        const tumb2 = isBroken
          ? rotatePoint(loc2, piece.rotation.x, piece.rotation.y, piece.rotation.z)
          : loc2;
        const tumbCore = isBroken
          ? rotatePoint(locCore, piece.rotation.x, piece.rotation.y, piece.rotation.z)
          : locCore;

        // 2. Apply 3D Particle Physics Drift Offset in the same frame as c, then rotate by global crystal orientation
        // This guarantees every 3D piece flies radially outward in 3D space regardless of stone rotation!
        const ox = piece.offset.x;
        const oy = piece.offset.y;
        const oz = piece.offset.z;
        const driftDist = Math.hypot(ox, oy, oz);
        sumDriftPx += driftDist * baseRadius;

        const shiftedCx = c.x + ox;
        const shiftedCy = c.y + oy;
        const shiftedCz = c.z + oz;

        const finalV0 = rotatePoint(
          { x: shiftedCx + tumb0.x, y: shiftedCy + tumb0.y, z: shiftedCz + tumb0.z },
          smoothState.rotX,
          smoothState.rotY,
          smoothState.rotZ
        );
        const finalV1 = rotatePoint(
          { x: shiftedCx + tumb1.x, y: shiftedCy + tumb1.y, z: shiftedCz + tumb1.z },
          smoothState.rotX,
          smoothState.rotY,
          smoothState.rotZ
        );
        const finalV2 = rotatePoint(
          { x: shiftedCx + tumb2.x, y: shiftedCy + tumb2.y, z: shiftedCz + tumb2.z },
          smoothState.rotX,
          smoothState.rotY,
          smoothState.rotZ
        );
        const finalCore = rotatePoint(
          { x: shiftedCx + tumbCore.x, y: shiftedCy + tumbCore.y, z: shiftedCz + tumbCore.z },
          smoothState.rotX,
          smoothState.rotY,
          smoothState.rotZ
        );

        // Project 3D -> 2D screen with perspective
        const project = (v: Vec3) => {
          const persp = 3.8 / Math.max(1.2, 3.8 - v.z * 0.55);
          return {
            x: cx + v.x * baseRadius * persp,
            y: cy + v.y * baseRadius * persp,
          };
        };

        const s0 = project(finalV0);
        const s1 = project(finalV1);
        const s2 = project(finalV2);
        const sCore = project(finalCore);

        const crossZ = (s1.x - s0.x) * (s2.y - s0.y) - (s1.y - s0.y) * (s2.x - s0.x);
        const avgZ = (finalV0.z + finalV1.z + finalV2.z) / 3;

        // Compute 3D surface normal for lighting/refraction
        const ux = finalV1.x - finalV0.x;
        const uy = finalV1.y - finalV0.y;
        const uz = finalV1.z - finalV0.z;
        const wx = finalV2.x - finalV0.x;
        const wy = finalV2.y - finalV0.y;
        const wz = finalV2.z - finalV0.z;
        let nx = uy * wz - uz * wy;
        let ny = uz * wx - ux * wz;
        let nz = ux * wy - uy * wx;
        const nLen = Math.hypot(nx, ny, nz) || 1;
        nx /= nLen;
        ny /= nLen;
        nz /= nLen;

        if (!isBroken && crossZ >= 0) {
          continue; // Back-face culling only when stone is intact
        }

        projectedPieces.push({
          id: piece.id,
          frontPts: [s0, s1, s2],
          corePt: sCore,
          centroidScreen: {
            x: (s0.x + s1.x + s2.x) / 3,
            y: (s0.y + s1.y + s2.y) / 3,
          },
          avgZ,
          crossZ,
          nx,
          ny,
          nz,
          tintType: piece.tintType,
          driftDist,
        });
      }

      // Sort pieces back-to-front by 3D Z depth
      projectedPieces.sort((a, b) => a.avgZ - b.avgZ);

      // Update debug telemetry for automated browser verification
      window.__glassStoneDebug = {
        phase: physicsState.phase,
        dispersionMetric: Number(shatterDispersion.toFixed(3)),
        shatterCount: soundEngine.getShatterCount(),
        avgPieceDriftPx: Math.round(sumDriftPx / Math.max(1, physicsState.pieces.length)),
      };
      canvas.setAttribute('data-stone-phase', physicsState.phase);

      // Render each 3D Volumetric Glass Piece (Side Fracture Walls + Front Refractive Facet)
      for (const piece of projectedPieces) {
        const [p0, p1, p2] = piece.frontPts;
        const pCore = piece.corePt;
        const { nx, ny, nz, tintType, driftDist } = piece;

        const keyDot = Math.max(0, nx * -0.45 + ny * -0.55 + nz * 0.7);
        const rimDot = Math.max(0, nx * 0.6 + ny * 0.5 + nz * 0.4);
        const fresnel = Math.pow(1 - Math.abs(nz), 2.0);
        const specular = Math.pow(Math.max(0, nx * -0.25 + ny * -0.35 + nz * 0.9), 10);

        ctx.save();

        // A. When broken, draw the 3 extruded 3D side walls of the glass wedge first!
        if (isBroken && driftDist > 0.015) {
          const sideWalls: [
            { x: number; y: number },
            { x: number; y: number },
            { x: number; y: number }
          ][] = [
            [p0, p1, pCore],
            [p1, p2, pCore],
            [p2, p0, pCore],
          ];

          for (let wIdx = 0; wIdx < sideWalls.length; wIdx++) {
            const [wa, wb, wc] = sideWalls[wIdx];
            ctx.beginPath();
            ctx.moveTo(wa.x, wa.y);
            ctx.lineTo(wb.x, wb.y);
            ctx.lineTo(wc.x, wc.y);
            ctx.closePath();

            if (darkTheme) {
              ctx.fillStyle =
                wIdx === 0
                  ? 'rgba(139, 92, 246, 0.38)'
                  : wIdx === 1
                  ? 'rgba(245, 158, 11, 0.28)'
                  : 'rgba(30, 27, 75, 0.68)';
              ctx.strokeStyle = 'rgba(216, 180, 254, 0.42)';
            } else {
              ctx.fillStyle =
                wIdx === 0
                  ? 'rgba(186, 230, 253, 0.65)'
                  : wIdx === 1
                  ? 'rgba(253, 230, 138, 0.55)'
                  : 'rgba(148, 163, 184, 0.65)';
              ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
            }
            ctx.lineWidth = 0.75;
            ctx.fill();
            ctx.stroke();
          }
        }

        // B. Draw the Primary Refractive Glass Facet
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.closePath();

        const grad = ctx.createLinearGradient(p0.x, p0.y, p2.x, p2.y);
        if (darkTheme) {
          const baseL = Math.round(24 + keyDot * 44 + fresnel * 38);
          grad.addColorStop(0, `rgba(${baseL + 26}, ${baseL + 20}, ${baseL + 62}, 0.86)`);
          if (tintType === 'violet' || tintType === 'cobalt') {
            grad.addColorStop(0.5, `rgba(139, 92, 246, ${0.46 + fresnel * 0.38})`);
          } else if (tintType === 'amber') {
            grad.addColorStop(0.5, `rgba(245, 158, 11, ${0.38 + specular * 0.48})`);
          } else if (tintType === 'cyan') {
            grad.addColorStop(0.5, `rgba(56, 189, 248, ${0.36 + fresnel * 0.38})`);
          } else {
            grad.addColorStop(0.5, `rgba(99, 102, 241, 0.48)`);
          }
          grad.addColorStop(1, `rgba(17, 20, 44, 0.88)`);
        } else {
          const l = Math.min(255, Math.round(205 + keyDot * 48));
          grad.addColorStop(0, `rgba(${l}, ${l + 2}, ${Math.min(255, l + 6)}, 0.9)`);
          if (tintType === 'cobalt' && fresnel > 0.18) {
            grad.addColorStop(0.48, `rgba(59, 130, 246, ${0.44 + rimDot * 0.35})`);
          } else if (tintType === 'amber' && keyDot > 0.2) {
            grad.addColorStop(0.48, `rgba(245, 158, 11, ${0.48 + specular * 0.35})`);
          } else if (tintType === 'cyan') {
            grad.addColorStop(0.5, `rgba(56, 189, 248, ${0.36 + fresnel * 0.35})`);
          } else {
            grad.addColorStop(0.5, `rgba(226, 232, 240, 0.92)`);
          }
          const endL = Math.max(145, Math.round(175 + rimDot * 65));
          grad.addColorStop(1, `rgba(${endL}, ${endL + 4}, ${endL + 10}, 0.92)`);
        }

        ctx.fillStyle = grad;
        ctx.fill();

        // Specular diamond highlight on face
        if (specular > 0.16 || isBroken) {
          const scx = piece.centroidScreen.x;
          const scy = piece.centroidScreen.y;
          const specGrad = ctx.createRadialGradient(scx, scy, 1, scx, scy, baseRadius * 0.28);
          specGrad.addColorStop(
            0,
            `rgba(255, 255, 255, ${Math.min(0.95, specular * 0.85 + shatterDispersion * 0.35)})`
          );
          specGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = specGrad;
          ctx.fill();
        }

        // Refractive bevel edge
        ctx.strokeStyle = isBroken
          ? `rgba(251, 191, 36, ${0.55 + Math.min(0.4, shatterDispersion * 0.45)})`
          : darkTheme
          ? `rgba(216, 180, 254, ${0.3 + specular * 0.5})`
          : `rgba(255, 255, 255, ${0.68 + specular * 0.32})`;
        ctx.lineWidth = isBroken ? 1.4 : 0.95;
        ctx.stroke();

        ctx.restore();
      }

      // ========================================================================
      // 5. FINE 3D GLASS MICRO-SPLINTER PARTICLES (BURSTING & FALLING WITH GRAVITY)
      // ========================================================================
      if (physicsState.splinters.length > 0) {
        ctx.save();
        for (const sp of physicsState.splinters) {
          const persp = 3.8 / Math.max(1.2, 3.8 - sp.z * 0.55);
          const sx = cx + sp.x * baseRadius * persp;
          const sy = cy + sp.y * baseRadius * persp;
          const sz = sp.size * persp;

          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate(sp.rot);

          ctx.beginPath();
          ctx.moveTo(0, -sz * 1.4);
          ctx.lineTo(sz * 0.85, 0);
          ctx.lineTo(0, sz * 1.4);
          ctx.lineTo(-sz * 0.85, 0);
          ctx.closePath();

          if (sp.tint === 'amber') {
            ctx.fillStyle = `rgba(251, 191, 36, ${sp.alpha * 0.9})`;
          } else if (sp.tint === 'cyan') {
            ctx.fillStyle = `rgba(125, 211, 252, ${sp.alpha * 0.9})`;
          } else if (sp.tint === 'violet') {
            ctx.fillStyle = `rgba(196, 181, 253, ${sp.alpha * 0.9})`;
          } else {
            ctx.fillStyle = `rgba(255, 255, 255, ${sp.alpha * 0.95})`;
          }
          ctx.fill();
          ctx.restore();
        }
        ctx.restore();
      }

      // ========================================================================
      // 6. FLOATING ORBITAL CRYSTAL SHARDS
      // ========================================================================
      if (smoothState.scatter > 0.04) {
        const scatterAmt = smoothState.scatter;
        shards.forEach((sh, idx) => {
          const curAngle = sh.angle + time * sh.speed * (1 + shatterDispersion * 0.8);
          const radiusDist =
            (baseRadius * 0.55 + sh.dist * scatterAmt + shatterDispersion * 65) *
            smoothState.scale;
          const sx = cx + Math.cos(curAngle) * radiusDist;
          const sy =
            cy + sh.yOff * scatterAmt + Math.sin(curAngle * 1.4) * (45 * scatterAmt);
          const sSize = sh.size * (0.45 + scatterAmt * 0.65) * smoothState.scale;

          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate(time * sh.speed * 0.8 + idx);

          ctx.beginPath();
          ctx.moveTo(0, -sSize);
          ctx.lineTo(sSize * 0.86, -sSize * 0.28);
          ctx.lineTo(sSize * 0.62, sSize * 0.82);
          ctx.lineTo(-sSize * 0.58, sSize * 0.88);
          ctx.lineTo(-sSize * 0.9, -sSize * 0.18);
          ctx.closePath();

          const shGrad = ctx.createLinearGradient(-sSize, -sSize, sSize, sSize);
          if (darkTheme) {
            shGrad.addColorStop(0, `rgba(91, 33, 182, ${0.72 * Math.min(1, scatterAmt * 1.5)})`);
            shGrad.addColorStop(0.5, `rgba(30, 27, 54, ${0.88 * Math.min(1, scatterAmt * 1.5)})`);
            shGrad.addColorStop(1, `rgba(245, 158, 11, ${0.48 * Math.min(1, scatterAmt * 1.5)})`);
          } else {
            shGrad.addColorStop(0, `rgba(250, 250, 252, ${0.92 * Math.min(1, scatterAmt * 1.5)})`);
            shGrad.addColorStop(0.5, `rgba(218, 224, 233, ${0.88 * Math.min(1, scatterAmt * 1.5)})`);
            shGrad.addColorStop(1, `rgba(186, 230, 253, ${0.78 * Math.min(1, scatterAmt * 1.5)})`);
          }
          ctx.fillStyle = shGrad;
          ctx.fill();
          ctx.strokeStyle = darkTheme ? 'rgba(216,180,254,0.45)' : 'rgba(255,255,255,0.85)';
          ctx.lineWidth = 1.1;
          ctx.stroke();
          ctx.restore();
        });
      }

      // ========================================================================
      // 7. IMPACT SHOCKWAVE RINGS ON SHATTER
      // ========================================================================
      for (let i = impactWaves.length - 1; i >= 0; i--) {
        const w = impactWaves[i];
        w.r += 16;
        w.alpha *= 0.89;
        ctx.save();
        ctx.strokeStyle = `rgba(251, 191, 36, ${w.alpha})`;
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        if (w.alpha < 0.03) impactWaves.splice(i, 1);
      }

      // ========================================================================
      // 8. ORBITING TEXT RING (FRONT HALF)
      // ========================================================================
      drawRingSlice(
        cx,
        cy,
        baseRadius * (1.62 + shatterDispersion * 0.35),
        baseRadius * (0.56 + shatterDispersion * 0.12),
        -0.38,
        time * 0.55,
        true,
        darkTheme
      );

      const frameDelay = 50;
      timerId = window.setTimeout(() => {
        animId = requestAnimationFrame(render);
      }, frameDelay);
    };

    render();

    return () => {
      clearTimeout(timerId);
      clearTimeout(timingState.autoRecoverTimer);
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('glass-stone-shatter', handleCustomShatter);
      window.removeEventListener('glass-stone-recover', handleCustomRecover);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      data-testid="daiki-crystal-canvas"
      className="fixed inset-0 pointer-events-none z-[5]"
      aria-hidden="true"
    />
  );
};
