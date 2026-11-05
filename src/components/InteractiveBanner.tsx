import React, { useEffect, useRef, useState } from 'react';
import { soundEngine } from '../utils/soundEngine';

interface InteractiveBannerProps {
  isDark: boolean;
}

type CorePreset = 'quantum' | 'cyber' | 'supernova';

interface StarNode {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  orbitR: number;
  orbitAngle: number;
  orbitSpeed: number;
  orbitTilt: number;
  colorIndex: number;
  size: number;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

// 3D Golden-Ratio Icosahedron vertices & edges for the central holographic core
const PHI = (1 + Math.sqrt(5)) / 2;
const RAW_VERTS: [number, number, number][] = [
  [-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0],
  [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI],
  [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1],
];
const VERTS = RAW_VERTS.map(([x, y, z]) => {
  const len = Math.hypot(x, y, z);
  return [x / len, y / len, z / len] as [number, number, number];
});

const EDGES: [number, number][] = [];
for (let i = 0; i < VERTS.length; i++) {
  for (let j = i + 1; j < VERTS.length; j++) {
    const d = Math.hypot(
      VERTS[i][0] - VERTS[j][0],
      VERTS[i][1] - VERTS[j][1],
      VERTS[i][2] - VERTS[j][2]
    );
    if (d < 1.2) {
      EDGES.push([i, j]);
    }
  }
}

export const InteractiveBanner: React.FC<InteractiveBannerProps> = ({ isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [preset, setPreset] = useState<CorePreset>('quantum');
  const presetRef = useRef<CorePreset>('quantum');

  useEffect(() => {
    presetRef.current = preset;
  }, [preset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let timerId: number;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      px: -9999,
      py: -9999,
      active: false,
    };

    let time = 0;
    let boostSpin = 0;
    let nodes: StarNode[] = [];
    const shockwaves: Shockwave[] = [];

    const PALETTES: Record<CorePreset, { primary: string; secondary: string; accent: string; glow: string }> = {
      quantum: {
        primary: '#A855F7',   // Electric Violet
        secondary: '#F59E0B', // Warm Amber Gold
        accent: '#38BDF8',    // Cyber Cyan
        glow: 'rgba(168, 85, 247, 0.28)',
      },
      cyber: {
        primary: '#06B6D4',   // Neon Cyan
        secondary: '#6366F1', // Electric Indigo
        accent: '#10B981',    // Emerald Matrix
        glow: 'rgba(6, 182, 212, 0.28)',
      },
      supernova: {
        primary: '#F59E0B',   // Solar Gold
        secondary: '#EC4899', // Magenta Rose
        accent: '#8B5CF6',    // Deep Violet
        glow: 'rgba(245, 158, 11, 0.28)',
      },
    };

    const initScene = () => {
      const container = containerRef.current;
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      if (!width || !height) return;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const maxR = Math.min(width * 0.46, height * 1.15);
      nodes = Array.from({ length: 140 }, (_, i) => {
        const u = (i + 0.5) / 140;
        return {
          x: (Math.random() - 0.5) * width,
          y: (Math.random() - 0.5) * height,
          z: Math.random(),
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          orbitR: 34 + Math.pow(u, 1.35) * maxR,
          orbitAngle: Math.random() * Math.PI * 2,
          orbitSpeed: (0.008 + (1 - u) * 0.022) * (i % 2 === 0 ? 1 : -0.8),
          orbitTilt: 0.26 + (i % 5) * 0.09,
          colorIndex: i % 3,
          size: 1.1 + (1 - u) * 1.8,
        };
      });
    };

    const rotate3D = (
      x: number,
      y: number,
      z: number,
      rx: number,
      ry: number,
      rz: number
    ): [number, number, number] => {
      // Rotate X
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const y1 = y * cosX - z * sinX;
      const z1 = y * sinX + z * cosX;
      // Rotate Y
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const x2 = x * cosY + z1 * sinY;
      const z2 = -x * sinY + z1 * cosY;
      // Rotate Z
      const cosZ = Math.cos(rz);
      const sinZ = Math.sin(rz);
      const x3 = x2 * cosZ - y1 * sinZ;
      const y3 = x2 * sinZ + y1 * cosZ;
      return [x3, y3, z2];
    };

    const handlePointerMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      mouse.px = e.clientX - rect.left;
      mouse.py = e.clientY - rect.top;
      mouse.targetX = (mouse.px / rect.width - 0.5) * 2;
      mouse.targetY = (mouse.py / rect.height - 0.5) * 2;
      mouse.active = true;
    };

    const handlePointerLeave = () => {
      mouse.targetX = 0;
      mouse.targetY = 0;
      mouse.active = false;
    };

    const handleCanvasClick = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const pal = PALETTES[presetRef.current];
      boostSpin = 0.14;
      shockwaves.push({
        x: cx,
        y: cy,
        radius: 8,
        maxRadius: Math.max(width, height) * 0.65,
        alpha: 0.85,
        color: pal.secondary,
      });
      soundEngine.playClick();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches || e.touches.length === 0) return;
      const touch = e.touches[0];
      handlePointerMove({
        clientX: touch.clientX,
        clientY: touch.clientY,
      } as MouseEvent);
    };

    const containerEl = containerRef.current;
    if (containerEl) {
      containerEl.addEventListener('mousemove', handlePointerMove);
      containerEl.addEventListener('mouseleave', handlePointerLeave);
      containerEl.addEventListener('touchstart', handleTouchMove, { passive: true });
      containerEl.addEventListener('touchmove', handleTouchMove, { passive: true });
      containerEl.addEventListener('touchend', handlePointerLeave, { passive: true });
    }
    canvas.addEventListener('click', handleCanvasClick);

    const resizeObserver = new ResizeObserver(initScene);
    if (containerEl) resizeObserver.observe(containerEl);
    initScene();

    let isVisible = true;

    const render = () => {
      time += 0.028 + boostSpin;
      boostSpin *= 0.92;

      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      const pal = PALETTES[presetRef.current];
      const cx = width / 2 + mouse.x * 18;
      const cy = height / 2 + mouse.y * 10;
      const coreRadius = Math.min(width, height) * 0.24;

      // 1. Deep Cosmic Canvas Backdrop
      ctx.fillStyle = '#060714';
      ctx.fillRect(0, 0, width, height);

      // 2. Multi-Layer Volumetric Nebula Aura
      const nebulaLeft = ctx.createRadialGradient(
        cx - width * 0.16,
        cy - height * 0.08,
        8,
        cx - width * 0.1,
        cy,
        width * 0.48
      );
      nebulaLeft.addColorStop(0, pal.glow);
      nebulaLeft.addColorStop(0.5, 'rgba(99, 102, 241, 0.09)');
      nebulaLeft.addColorStop(1, 'rgba(6, 7, 20, 0)');
      ctx.fillStyle = nebulaLeft;
      ctx.fillRect(0, 0, width, height);

      const nebulaRight = ctx.createRadialGradient(
        cx + width * 0.16,
        cy + height * 0.08,
        8,
        cx + width * 0.1,
        cy,
        width * 0.45
      );
      nebulaRight.addColorStop(0, 'rgba(245, 158, 11, 0.18)');
      nebulaRight.addColorStop(0.55, 'rgba(56, 189, 248, 0.08)');
      nebulaRight.addColorStop(1, 'rgba(6, 7, 20, 0)');
      ctx.fillStyle = nebulaRight;
      ctx.fillRect(0, 0, width, height);

      // 3. Subtle 3D Perspective Cyber-Grid Horizon
      ctx.save();
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.07)';
      ctx.lineWidth = 1;
      const horizonY = height * 0.52 + mouse.y * 8;
      for (let i = -8; i <= 8; i++) {
        ctx.beginPath();
        ctx.moveTo(cx + i * 26, horizonY);
        ctx.lineTo(cx + i * 145, height + 10);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx + i * 26, horizonY);
        ctx.lineTo(cx + i * 145, -10);
        ctx.stroke();
      }
      ctx.restore();

      // 4. Orbiting Relativistic Vortex & Neural Constellation Nodes
      const colors = [pal.primary, pal.secondary, pal.accent];
      const screenPositions: { x: number; y: number; color: string }[] = [];

      for (const n of nodes) {
        n.orbitAngle += n.orbitSpeed + boostSpin * 0.4;
        const angle = n.orbitAngle;
        const tilt = n.orbitTilt + mouse.y * 0.12;
        const rotOffset = -0.18 + mouse.x * 0.18;

        const ox = Math.cos(angle) * n.orbitR;
        const oy = Math.sin(angle) * n.orbitR * tilt;
        const cosR = Math.cos(rotOffset);
        const sinR = Math.sin(rotOffset);

        let sx = cx + ox * cosR - oy * sinR;
        let sy = cy + ox * sinR + oy * cosR;

        // Interactive cursor magnetic pull
        if (mouse.active) {
          const dx = mouse.px - sx;
          const dy = mouse.py - sy;
          const dist = Math.hypot(dx, dy);
          if (dist < 140 && dist > 1) {
            const pull = (1 - dist / 140) * 18;
            sx += (dx / dist) * pull;
            sy += (dy / dist) * pull;
          }
        }

        const c = colors[n.colorIndex];
        screenPositions.push({ x: sx, y: sy, color: c });

        ctx.fillStyle = c;
        ctx.globalAlpha = 0.45 + Math.sin(angle + time) * 0.3;
        ctx.beginPath();
        ctx.arc(sx, sy, n.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw subtle neural filaments near cursor or center
      ctx.lineWidth = 0.75;
      for (let i = 0; i < screenPositions.length; i += 2) {
        const p1 = screenPositions[i];
        if (mouse.active) {
          const dMouse = Math.hypot(p1.x - mouse.px, p1.y - mouse.py);
          if (dMouse < 130) {
            ctx.strokeStyle = pal.accent;
            ctx.globalAlpha = (1 - dMouse / 130) * 0.42;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.px, mouse.py);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      // 5. Three 3D Tilted Gyroscopic Orbital Rings around the Core
      const ringConfigs = [
        { r: coreRadius * 1.62, rx: 1.15 + mouse.y * 0.3, ry: time * 0.7, rz: 0.35, color: pal.secondary, dash: [8, 6] },
        { r: coreRadius * 1.32, rx: -0.95, ry: -time * 0.9, rz: -0.5 + mouse.x * 0.3, color: pal.primary, dash: [] },
        { r: coreRadius * 1.92, rx: 1.32, ry: time * 0.45, rz: -0.22, color: pal.accent, dash: [3, 9] },
      ];

      for (const ring of ringConfigs) {
        ctx.save();
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = 1.35;
        ctx.globalAlpha = 0.68;
        ctx.setLineDash(ring.dash);
        ctx.beginPath();
        const steps = 64;
        for (let s = 0; s <= steps; s++) {
          const theta = (s / steps) * Math.PI * 2;
          const [rx, ry, rz] = rotate3D(
            Math.cos(theta) * ring.r,
            Math.sin(theta) * ring.r,
            0,
            ring.rx,
            ring.ry,
            ring.rz
          );
          const perspective = 320 / (320 - rz);
          const px = cx + rx * perspective;
          const py = cy + ry * perspective;
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.restore();
      }

      // 6. Central Quantum Singularity Sphere + Glowing 3D Geodesic Wireframe Core
      const coreGlow = ctx.createRadialGradient(cx, cy, coreRadius * 0.1, cx, cy, coreRadius * 1.35);
      coreGlow.addColorStop(0, 'rgba(255, 255, 255, 0.92)');
      coreGlow.addColorStop(0.22, pal.secondary);
      coreGlow.addColorStop(0.58, pal.primary);
      coreGlow.addColorStop(1, 'rgba(6, 7, 20, 0)');
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // Inner dark refractive sphere so the 3D wireframe pops with contrast
      ctx.fillStyle = 'rgba(7, 8, 22, 0.84)';
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius * 0.82, 0, Math.PI * 2);
      ctx.fill();

      // Project & draw 3D Icosahedron wireframe inside/around the core
      const projectedVerts = VERTS.map(([vx, vy, vz]) => {
        const [rx, ry, rz] = rotate3D(
          vx * coreRadius * 0.92,
          vy * coreRadius * 0.92,
          vz * coreRadius * 0.92,
          time * 0.65 + mouse.y * 0.6,
          time * 0.85 + mouse.x * 0.6,
          time * 0.35
        );
        const scale = 300 / (300 - rz);
        return {
          x: cx + rx * scale,
          y: cy + ry * scale,
          z: rz,
        };
      });

      ctx.lineWidth = 1.2;
      for (const [i, j] of EDGES) {
        const v1 = projectedVerts[i];
        const v2 = projectedVerts[j];
        const depthAlpha = Math.max(0.18, Math.min(0.95, 0.55 + (v1.z + v2.z) / (coreRadius * 2.5)));
        ctx.strokeStyle = v1.z + v2.z > 0 ? pal.secondary : pal.primary;
        ctx.globalAlpha = depthAlpha;
        ctx.beginPath();
        ctx.moveTo(v1.x, v1.y);
        ctx.lineTo(v2.x, v2.y);
        ctx.stroke();
      }

      // Draw glowing vertex nodes on front-facing vertices
      for (const v of projectedVerts) {
        if (v.z > -coreRadius * 0.2) {
          ctx.fillStyle = '#FFFFFF';
          ctx.globalAlpha = 0.85;
          ctx.beginPath();
          ctx.arc(v.x, v.y, 2.1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      // 7. Expanding Click Shockwaves
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += 9;
        sw.alpha *= 0.92;
        ctx.strokeStyle = sw.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = sw.alpha;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.stroke();
        if (sw.alpha < 0.03 || sw.radius > sw.maxRadius) {
          shockwaves.splice(i, 1);
        }
      }
      ctx.globalAlpha = 1;

      if (isVisible) {
        timerId = window.setTimeout(() => {
          animId = requestAnimationFrame(render);
        }, 70);
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          const wasVisible = isVisible;
          isVisible = entry.isIntersecting;
          if (isVisible && !wasVisible) {
            clearTimeout(timerId);
            cancelAnimationFrame(animId);
            animId = requestAnimationFrame(render);
          }
        }
      },
      { threshold: 0.05 }
    );
    if (containerEl) io.observe(containerEl);

    render();

    return () => {
      clearTimeout(timerId);
      cancelAnimationFrame(animId);
      io.disconnect();
      resizeObserver.disconnect();
      if (containerEl) {
        containerEl.removeEventListener('mousemove', handlePointerMove);
        containerEl.removeEventListener('mouseleave', handlePointerLeave);
        containerEl.removeEventListener('touchstart', handleTouchMove);
        containerEl.removeEventListener('touchmove', handleTouchMove);
        containerEl.removeEventListener('touchend', handlePointerLeave);
      }
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [isDark]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-52 sm:h-60 md:h-68 rounded-2xl overflow-hidden border border-purple-500/25 dark:border-purple-500/25 light:border-stone-300/90 bg-[#060714] shadow-[0_20px_60px_rgba(0,0,0,0.55)] group"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block cursor-crosshair"
      />

      {/* Top-Right Interactive Visual Core Switcher */}
      <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-20 flex items-center gap-0.5 sm:gap-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full p-0.5 sm:p-1 max-w-[calc(100%-1.25rem)] overflow-x-auto">
        {(
          [
            { id: 'quantum', label: 'Quantum Prism' },
            { id: 'cyber', label: 'Cyber Matrix' },
            { id: 'supernova', label: 'Supernova' },
          ] as { id: CorePreset; label: string }[]
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.playClick();
              setPreset(item.id);
            }}
            className={`px-2 sm:px-2.5 py-1 rounded-full text-[8.5px] sm:text-[9px] font-mono uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              preset === item.id
                ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                : 'text-neutral-300 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Subtle Vignette Frame */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_55px_rgba(0,0,0,0.65)]" />

      {/* Bottom-Right Interactive Telemetry Caption */}
      <div className="absolute bottom-2.5 right-3 sm:bottom-3 sm:right-4 pointer-events-none text-[9px] sm:text-[10px] font-mono tracking-wider sm:tracking-widest uppercase text-neutral-300/90 flex items-center gap-1.5 sm:gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
        <span className="hidden xs:inline sm:inline">INTERACTIVE 3D QUANTUM CORE · MOVE &amp; CLICK</span>
        <span className="inline sm:hidden">3D QUANTUM CORE · TAP / MOVE</span>
      </div>
    </div>
  );
};
