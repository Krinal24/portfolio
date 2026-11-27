import { useEffect, useRef, useState } from "react";
import { impactStats } from "../constants";

const DURATION_MS = 1400;

function useCountUp(target, start) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frame = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(frame);
    }

    let frame;
    const startedAt = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - startedAt) / DURATION_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, start]);

  return value;
}

function Stat({ stat, start, index }) {
  const value = useCountUp(stat.value, start);
  return (
    <li className="impact-stat" style={{ "--stat-index": index }}>
      <span className="impact-value">
        {stat.prefix}
        {stat.value ? value.toLocaleString("en-US") : stat.display}
        {stat.suffix}
      </span>
      <span className="impact-label">{stat.label}</span>
      <span className="impact-source">{stat.source}</span>
    </li>
  );
}

function ImpactStats() {
  const listRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.35 });
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="impact-section" aria-label="Impact at a glance">
      <ul className={`impact-strip ${visible ? "is-visible" : ""}`} ref={listRef}>
        {impactStats.map((stat, index) => (
          <Stat stat={stat} start={visible} index={index} key={stat.label} />
        ))}
      </ul>
    </section>
  );
}

export default ImpactStats;
