import { useEffect, useRef } from "react";

const TRAIL_LIFE_MS = 520;     // how long each dot takes to fade
const SPACING_PX = 6;          // fill gaps between pointer events so fast moves stay smooth
const MAX_POINTS = 90;
const RIPPLE_LIFE_MS = 550;

// amber (#f59e0b) at the cursor -> violet (#a855f7) at the tail
const HEAD = [245, 158, 11];
const TAIL = [168, 85, 247];
const mix = (t) => HEAD.map((value, i) => Math.round(value + (TAIL[i] - value) * t));

// A fading comet tail of glowing dots behind the normal cursor, plus a soft ripple on click.
// Drawn on one full-screen canvas that ignores the mouse; the animation loop only runs while
// something is still visible. Off on touch screens and for people who prefer reduced motion.
function CursorTrail() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canvas || !finePointer || reducedMotion) return undefined;

    const ctx = canvas.getContext("2d");
    const points = [];
    const ripples = [];
    let last = null;
    let frame = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const dark = document.body.classList.contains("dark");
      ctx.globalCompositeOperation = dark ? "lighter" : "source-over";

      while (points.length && now - points[0].born > TRAIL_LIFE_MS) points.shift();
      points.forEach((point, index) => {
        const age = (now - point.born) / TRAIL_LIFE_MS;          // 0 new -> 1 gone
        const along = 1 - index / Math.max(points.length - 1, 1); // 0 head -> 1 tail
        const [r, g, b] = mix(Math.min(1, along * 0.9 + age * 0.4));
        const radius = 6.5 * (1 - age) + 0.6;
        const alpha = (1 - age) * (dark ? 0.55 : 0.68);

        ctx.beginPath();
        ctx.arc(point.x, point.y, radius * 2.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.18})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fill();
      });

      while (ripples.length && now - ripples[0].born > RIPPLE_LIFE_MS) ripples.shift();
      ripples.forEach((ripple) => {
        const t = (now - ripple.born) / RIPPLE_LIFE_MS;
        const eased = 1 - Math.pow(1 - t, 3);
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, 6 + eased * 30, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(245, 158, 11, ${(1 - t) * 0.6})`;
        ctx.lineWidth = 2 * (1 - t) + 0.5;
        ctx.stroke();
      });

      frame = points.length || ripples.length ? requestAnimationFrame(draw) : 0;
    };

    const wake = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const handleMove = (event) => {
      if (event.pointerType !== "mouse") return;
      const now = performance.now();
      const next = { x: event.clientX, y: event.clientY };
      if (last) {
        const steps = Math.min(12, Math.floor(Math.hypot(next.x - last.x, next.y - last.y) / SPACING_PX));
        for (let i = 1; i <= steps; i++) {
          points.push({ x: last.x + ((next.x - last.x) * i) / (steps + 1), y: last.y + ((next.y - last.y) * i) / (steps + 1), born: now });
        }
      }
      points.push({ ...next, born: now });
      if (points.length > MAX_POINTS) points.splice(0, points.length - MAX_POINTS);
      last = next;
      wake();
    };

    const handleDown = (event) => {
      if (event.pointerType !== "mouse") return;
      ripples.push({ x: event.clientX, y: event.clientY, born: performance.now() });
      wake();
    };

    const handleLeave = () => { last = null; };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerdown", handleDown, { passive: true });
    document.documentElement.addEventListener("pointerleave", handleLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerdown", handleDown);
      document.documentElement.removeEventListener("pointerleave", handleLeave);
    };
  }, []);

  return <canvas className="cursor-trail" ref={canvasRef} aria-hidden="true" />;
}

export default CursorTrail;
