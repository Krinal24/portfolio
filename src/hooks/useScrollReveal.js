import { useEffect, useRef } from "react";

// Adds "is-visible" to every .scroll-reveal element inside the returned ref once it scrolls into view.
export function useScrollReveal() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !("IntersectionObserver" in window)) return undefined;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });

    container.querySelectorAll(".scroll-reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return containerRef;
}
