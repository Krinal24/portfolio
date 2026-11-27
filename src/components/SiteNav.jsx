import { useEffect, useRef, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

const sections = [
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "certifications", label: "Certificates" },
  { id: "education", label: "Education" },
  { id: "fun", label: "Fun" },
];

function SiteNav({ darkMode, onToggleTheme }) {
  const [activeId, setActiveId] = useState(null);
  const progressRef = useRef(null);

  // On scroll (at most once per frame): move the progress bar and work out which section
  // is under the top third of the screen. The bar is written straight to the DOM so
  // scrolling doesn't re-render the nav; the active link only re-renders when it changes.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;

      const marker = window.innerHeight * 0.35;
      let current = null;
      sections.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= marker) current = id;
      });
      setActiveId(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <nav className="navbar" aria-label="Main">
      <a className="nav-logo" href="#home">Krinal N</a>

      <div className="nav-links">
        <ul className="nav-sections">
          {sections.map(({ id, label }) => (
            <li key={id}>
              <a href={`#${id}`} className={activeId === id ? "is-active" : undefined} aria-current={activeId === id ? "location" : undefined}>
                {label}
              </a>
            </li>
          ))}
        </ul>

        <button className="theme-toggle" type="button" onClick={onToggleTheme} aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>
      </div>

      <span className="nav-progress" ref={progressRef} aria-hidden="true" />
    </nav>
  );
}

export default SiteNav;
