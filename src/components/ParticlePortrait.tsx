import React, { useEffect, useRef } from 'react';

interface ParticlePortraitProps {
  photoUrl: string;
  isDark: boolean;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  color: string;
  alpha: number;
  noiseOffset: number;
}

interface Sparkle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxAlpha: number;
}

export const ParticlePortrait: React.FC<ParticlePortraitProps> = ({ photoUrl, isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let particles: Particle[] = [];
    let sparkles: Sparkle[] = [];
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      localX: -9999,
      localY: -9999,
      isInside: false,
    };
    let time = 0;
    let rippleTime = -10;
    let rippleOrigin = { x: 0, y: 0 };

    const initCanvas = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      if (!width || !height) return;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Generate procedural face silhouette point-cloud fallback
    const generateProceduralSilhouette = () => {
      const pts: Particle[] = [];
      const centerX = 0;
      const centerY = -15;
      const count = 2800;

      for (let i = 0; i < count; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * Math.PI * 2;
        const phi = (v - 0.5) * Math.PI;

        const rx = 85 + Math.sin(theta * 3) * 8;
        const ry = 110 + Math.cos(phi * 2) * 10;
        const rz = 70;

        const x =
          centerX + Math.cos(theta) * Math.cos(phi) * rx * (0.3 + 0.7 * Math.sqrt(Math.random()));
        const y =
          centerY +
          Math.sin(phi) * ry * (0.3 + 0.7 * Math.sqrt(Math.random())) +
          Math.sin(theta) * 15;
        const z = Math.sin(theta) * Math.cos(phi) * rz;

        const r = Math.random();
        let color = 'rgba(217, 119, 6, 0.85)';
        const alpha = 0.4 + Math.random() * 0.5;

        if (r < 0.25) {
          color = 'rgba(99, 102, 241, 0.75)';
        } else if (r < 0.55) {
          color = 'rgba(245, 158, 11, 0.9)';
        } else if (r < 0.75) {
          color = 'rgba(255, 255, 255, 0.85)';
        }

        pts.push({
          x,
          y,
          z,
          baseX: x,
          baseY: y,
          baseZ: z,
          vx: 0,
          vy: 0,
          vz: 0,
          size: 1.1 + Math.random() * 1.5,
          color,
          alpha,
          noiseOffset: Math.random() * 100,
        });
      }

      particles = pts;
    };

    // Original crisp photo point-cloud sampling with dispersion-in assembly animation
    const samplePhoto = () => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = photoUrl;

      img.onload = () => {
        try {
          const offCanvas = document.createElement('canvas');
          const offCtx = offCanvas.getContext('2d');
          if (!offCtx) {
            generateProceduralSilhouette();
            return;
          }

          const targetSize = 140;
          offCanvas.width = targetSize;
          offCanvas.height = targetSize;
          offCtx.drawImage(img, 0, 0, targetSize, targetSize);

          const imgData = offCtx.getImageData(0, 0, targetSize, targetSize).data;
          const sampledPts: Particle[] = [];

          const step = 2;
          for (let y = 0; y < targetSize; y += step) {
            for (let x = 0; x < targetSize; x += step) {
              const idx = (y * targetSize + x) * 4;
              const r = imgData[idx];
              const g = imgData[idx + 1];
              const b = imgData[idx + 2];
              const a = imgData[idx + 3];

              if (a > 30) {
                const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
                if (brightness > 0.18 && brightness < 0.94) {
                  const px = (x - targetSize / 2) * 2.3;
                  const py = (y - targetSize / 2) * 2.3 - 10;
                  const pz = (brightness - 0.5) * 80;

                  let color = 'rgba(217, 119, 6, 0.85)';
                  if (brightness > 0.7) {
                    color = 'rgba(255, 255, 255, 0.9)'; // highlight white
                  } else if (brightness > 0.45) {
                    color = 'rgba(245, 158, 11, 0.85)'; // amber
                  } else {
                    color = 'rgba(99, 102, 241, 0.65)'; // deep electric indigo
                  }

                  sampledPts.push({
                    x: px,
                    y: py,
                    z: pz,
                    baseX: px,
                    baseY: py,
                    baseZ: pz,
                    vx: 0,
                    vy: 0,
                    vz: 0,
                    size: 1.0 + brightness * 1.4,
                    color,
                    alpha: 0.35 + brightness * 0.55,
                    noiseOffset: (x * 7 + y * 13) % 100,
                  });
                }
              }
            }
          }

          if (sampledPts.length > 500) {
            particles = sampledPts;
          } else {
            generateProceduralSilhouette();
          }
        } catch {
          generateProceduralSilhouette();
        }
      };

      img.onerror = () => {
        generateProceduralSilhouette();
      };
    };

    // Ambient floating stardust sparkles
    sparkles = Array.from({ length: 65 }, () => ({
      x: (Math.random() - 0.5) * 600,
      y: (Math.random() - 0.5) * 500,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -0.22 - Math.random() * 0.35,
      size: 0.8 + Math.random() * 1.5,
      alpha: Math.random() * 0.7,
      maxAlpha: 0.4 + Math.random() * 0.5,
    }));

    initCanvas();
    samplePhoto();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      mouse.isInside = inside;
      mouse.localX = e.clientX - rect.left;
      mouse.localY = e.clientY - rect.top;
      mouse.targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const handleMouseLeave = () => {
      mouse.targetX = 0;
      mouse.targetY = 0;
      mouse.isInside = false;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const cx = width / 2;
      const cy = height / 2;
      rippleOrigin = {
        x: e.clientX - rect.left - cx,
        y: e.clientY - rect.top - cy,
      };
      rippleTime = time;
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
    container.addEventListener('touchstart', handleTouchMove, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('click', handleClick);

    const resizeObserver = new ResizeObserver(() => {
      initCanvas();
    });
    resizeObserver.observe(container);

    // Animation Loop with 3D Perspective Rotation, Holographic Wave & Cursor Physics
    const render = () => {
      time += 0.025;
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const fov = 380;

      // Smooth idle 3D sway + cursor 3D rotation
      const idleY = Math.sin(time * 0.55) * 0.12;
      const idleX = Math.cos(time * 0.4) * 0.06;
      const rotY = idleY + mouse.x * 0.38;
      const rotX = idleX - mouse.y * 0.28;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // Render floating sparkles
      for (const sp of sparkles) {
        sp.x += sp.vx;
        sp.y += sp.vy;
        if (sp.y < -height / 2) sp.y = height / 2;
        if (sp.x < -width / 2) sp.x = width / 2;
        if (sp.x > width / 2) sp.x = -width / 2;

        const sx = centerX + sp.x;
        const sy = centerY + sp.y;

        ctx.fillStyle = isDark
          ? `rgba(245, 158, 11, ${sp.alpha * 0.5})`
          : `rgba(180, 83, 9, ${sp.alpha * 0.35})`;
        ctx.beginPath();
        ctx.arc(sx, sy, sp.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Travelling holographic diagonal shimmer wave across the portrait
      const scanWavePos = ((time * 95) % 520) - 260;
      const activeRippleAge = time - rippleTime;

      // Render particle portrait vertices
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 3D ripple wave on click + organic breathing wave
        let waveZ = Math.sin(time * 1.4 + p.baseX * 0.025 + p.baseY * 0.025) * 4.5;
        if (activeRippleAge >= 0 && activeRippleAge < 2.2) {
          const distFromClick = Math.hypot(p.baseX - rippleOrigin.x, p.baseY - rippleOrigin.y);
          const ringRadius = activeRippleAge * 190;
          const ringDiff = Math.abs(distFromClick - ringRadius);
          if (ringDiff < 38) {
            const pulse = (1 - ringDiff / 38) * Math.max(0, 1 - activeRippleAge / 2.2);
            waveZ += Math.sin((distFromClick - ringRadius) * 0.15) * 32 * pulse;
          }
        }

        // Spring physics returning displaced particles smoothly back to base position
        p.vx *= 0.84;
        p.vy *= 0.84;
        p.vz *= 0.84;

        const breath = Math.sin(time + p.noiseOffset) * 2.2;
        const curX = p.baseX + p.vx + Math.cos(time * 0.9 + p.noiseOffset) * 1.4;
        const curY = p.baseY + p.vy + breath;
        const curZ = p.baseZ + p.vz + waveZ + Math.sin(time * 0.9 + p.noiseOffset) * 1.8;

        // 3D Rotation
        const x1 = curX * cosY + curZ * sinY;
        const z1 = -curX * sinY + curZ * cosY;

        const y2 = curY * cosX - z1 * sinX;
        const z2 = curY * sinX + z1 * cosX;

        // Perspective projection
        const scale = fov / (fov + z2 + 100);
        const projX = centerX + x1 * scale;
        const projY = centerY + y2 * scale;

        // Interactive cursor magnetic scatter & 3D lift when hovering over the point cloud
        if (mouse.isInside) {
          const dx = projX - mouse.localX;
          const dy = projY - mouse.localY;
          const dist = Math.hypot(dx, dy);
          if (dist < 48 && dist > 0.1) {
            const push = (1 - dist / 48) * 2.4;
            p.vx += (dx / dist) * push;
            p.vy += (dy / dist) * push;
            p.vz -= push * 3.2;
          }
        }

        // Holographic scan-line shimmer boost
        const diagCoord = (p.baseX + p.baseY) * 0.5;
        const scanDist = Math.abs(diagCoord - scanWavePos);
        const scanBoost = scanDist < 28 ? (1 - scanDist / 28) * 0.35 : 0;

        const depthAlpha = Math.max(
          0.12,
          Math.min(1, scale * 1.1 * p.alpha + scanBoost)
        );

        ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${depthAlpha.toFixed(2)})`);
        const finalSize = Math.max(0.85, (p.size + scanBoost * 0.9) * scale);

        ctx.fillRect(projX - finalSize / 2, projY - finalSize / 2, finalSize, finalSize);
      }

      if (isVisible) {
        timerId = window.setTimeout(() => {
          animId = requestAnimationFrame(render);
        }, 55);
      }
    };

    let timerId: number;
    let isVisible = true;
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
    io.observe(container);

    render();

    return () => {
      clearTimeout(timerId);
      cancelAnimationFrame(animId);
      io.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('click', handleClick);
      container.removeEventListener('touchmove', handleTouchMove);
      resizeObserver.disconnect();
    };
  }, [photoUrl, isDark]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[350px] sm:h-[460px] md:h-[520px] flex items-center justify-center overflow-hidden select-none pointer-events-auto"
      aria-label="Interactive 3D particle silhouette portrait of Sachin"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block cursor-crosshair" />

      {/* Subtle radial ambient spotlight glow */}
      <div className="absolute inset-0 pointer-events-none bg-radial from-amber-500/10 via-indigo-500/5 to-transparent blur-3xl" />

      {/* Floating status badge */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-6 pointer-events-none flex items-center gap-2 text-[10px] font-mono text-neutral-400 dark:text-neutral-400 light:text-neutral-600 bg-neutral-900/60 dark:bg-neutral-900/60 light:bg-white/80 border border-neutral-800 dark:border-neutral-800 light:border-stone-300 px-2.5 py-1 rounded-full backdrop-blur-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
        <span>3D Point Cloud · Touch / Move</span>
      </div>
    </div>
  );
};
