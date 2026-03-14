import { useEffect, useRef, useCallback } from 'react';

const TRAIL_LENGTH = 8;

export default function MouseTrail() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -200, y: -200 });
  const dotsRef = useRef(
    Array.from({ length: TRAIL_LENGTH }, () => ({ x: -200, y: -200 }))
  );
  const rafRef = useRef(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const trail = dotsRef.current;

    trail[0].x += (mouseRef.current.x - trail[0].x) * 0.45;
    trail[0].y += (mouseRef.current.y - trail[0].y) * 0.45;

    for (let i = 1; i < trail.length; i++) {
      const ease = 0.3 - i * 0.02;
      trail[i].x += (trail[i - 1].x - trail[i].x) * Math.max(ease, 0.06);
      trail[i].y += (trail[i - 1].y - trail[i].y) * Math.max(ease, 0.06);
    }

    // Draw a single subtle fading line
    ctx.beginPath();
    ctx.moveTo(trail[0].x, trail[0].y);
    for (let i = 1; i < trail.length; i++) {
      const xc = (trail[i].x + trail[i - 1].x) / 2;
      const yc = (trail[i].y + trail[i - 1].y) / 2;
      ctx.quadraticCurveTo(trail[i - 1].x, trail[i - 1].y, xc, yc);
    }
    ctx.strokeStyle = 'rgba(75, 184, 138, 0.08)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Draw minimal dots — very small and subtle
    for (let i = 0; i < trail.length; i++) {
      const { x, y } = trail[i];
      const size = Math.max(1.5, 4 - i * 0.4);
      const opacity = Math.max(0.05, 0.3 - i * 0.035);

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(75, 184, 138, ${opacity})`;
      ctx.fill();
    }

    rafRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9998 }}
      aria-hidden="true"
    />
  );
}
