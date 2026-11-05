import React, { useEffect, useRef } from 'react';

interface BackgroundFlowfieldProps {
  isDark: boolean;
}

export const BackgroundFlowfield: React.FC<BackgroundFlowfieldProps> = ({ isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const mouse = { x: -999, y: -999 };
    let time = 0;

    interface Particle {
      x: number;
      y: number;
    }

    let particles: Particle[] = [];

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Reset particles
      const count = Math.min(480, Math.floor((width * height) / 3200));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
      }));
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();

    const render = () => {
      time += 0.0016;

      // Soft fading trail
      ctx.fillStyle = isDark ? 'rgba(9, 10, 15, 0.08)' : 'rgba(247, 246, 242, 0.08)';
      ctx.fillRect(0, 0, width, height);

      // Particle dots color
      ctx.fillStyle = isDark ? 'rgba(245, 158, 11, 0.45)' : 'rgba(180, 83, 9, 0.35)';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        // Perlin-style curl noise angle
        const angle = (Math.sin(p.x * 0.0022 + time * 3) + Math.cos(p.y * 0.0026 - time * 2)) * Math.PI;
        let vx = Math.cos(angle) * 0.65;
        let vy = Math.sin(angle) * 0.65;

        // Mouse avoidance/attraction
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 140) {
          const force = ((1 - dist / 140) * 2.8) / (dist + 1);
          vx += dx * force;
          vy += dy * force;
        }

        p.x += vx;
        p.y += vy;

        // Wrap edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillRect(p.x, p.y, 1.4, 1.4);
      }

      timerId = window.setTimeout(() => {
        animId = requestAnimationFrame(render);
      }, 45);
    };

    let timerId: number;
    render();

    return () => {
      clearTimeout(timerId);
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60"
      aria-hidden="true"
    />
  );
};
