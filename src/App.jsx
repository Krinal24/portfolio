import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { taglines } from "./constants";

import { FaLinkedin, FaGithub } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { FiSun, FiMoon } from "react-icons/fi";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHoveringLink, setIsHoveringLink] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    const handlePointerEnter = (event) => {
      if (event.target.closest("a, button")) {
        setIsHoveringLink(true);
      }
    };

    const handlePointerLeave = (event) => {
      if (event.target.closest("a, button")) {
        setIsHoveringLink(false);
      }
    };

    window.addEventListener("pointermove", handleMouseMove);
    document.body.addEventListener("pointerover", handlePointerEnter);
    document.body.addEventListener("pointerout", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handleMouseMove);
      document.body.removeEventListener("pointerover", handlePointerEnter);
      document.body.removeEventListener("pointerout", handlePointerLeave);
    };
  }, []);

  useEffect(() => {
    const currentTagline = taglines[taglineIndex];
    const typingSpeed = isDeleting ? 25 : 55;

    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex < currentTagline.length) {
        const nextCharIndex = charIndex + 1;
        setTypedText(currentTagline.slice(0, nextCharIndex));
        setCharIndex(nextCharIndex);
        return;
      }

      if (!isDeleting && charIndex === currentTagline.length) {
        setTimeout(() => setIsDeleting(true), 900);
        return;
      }

      if (isDeleting && charIndex > 0) {
        const nextCharIndex = charIndex - 1;
        setTypedText(currentTagline.slice(0, nextCharIndex));
        setCharIndex(nextCharIndex);
        return;
      }

      if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setTaglineIndex((taglineIndex + 1) % taglines.length);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, taglineIndex]);

  const prompts = [
    "Experience",
    "Projects",
    "Skills",
    "Certifications",
    "Achievements",
    "Tell me something fun",
  ];

  return (
    <div className="app">
      <div
        className={`custom-cursor ${isHoveringLink ? "hovering" : ""}`}
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
        }}
      >
        <div className="cursor-core" />
      </div>

      <nav className="navbar">
        <div className="nav-logo">Krinal N</div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#contact">Contact</a>

          <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
        </div>
      </nav>

      <section className="hero" id="home">
        <div className="hero-inner hero-layout">
          <div className="hero-copy">
            <p className="greeting">Hi There.</p>

            <h1 className="name">
              I am <span>Krinal Naghera</span>
            </h1>

            <p className="subtitle">Software Engineer at Telstra</p>

            <div className="typing-block" aria-live="polite">
              <span>{typedText}</span>
              <span className="cursor" aria-hidden="true"></span>
            </div>

            <p className="subtitle">Find me on:</p>

            <div className="socials">
              <a href="https://github.com/Krinal24" target="_blank" rel="noreferrer" aria-label="GitHub">
                <FaGithub />
              </a>
              <a href="https://linkedin.com/in/krinal-naghera/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
              <a href="https://leetcode.com/u/Kinu2404" target="_blank" rel="noreferrer" aria-label="LeetCode">
                <SiLeetcode />
              </a>
            </div>
          </div>

          <div className="hero-panel">
            <p className="panel-title">What do you want to learn about me?</p>

            <div className="prompt-list">
              {prompts.map((prompt) => (
                <button key={prompt} className="prompt-pill" type="button">
                  {prompt}
                </button>
              ))}
            </div>

            <a href="#contact" className="connect-card" aria-label="Connect with me">
              <span>Connect with me</span>
              <span className="connect-arrow">→</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}

export default App;