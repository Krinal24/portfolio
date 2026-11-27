import { useEffect, useState } from "react";
import { promptOptions, taglines } from "../constants";
import { socialLinks } from "./socialLinks";

const promptSections = {
  Experience: "experience",
  Projects: "projects",
  Skills: "skills",
  Education: "education",
  "Certifications & Achievements": "certifications",
  "Something fun": "fun",
};

// Types each tagline out, pauses, deletes it, then moves to the next one.
function useTypewriter(lines) {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const line = lines[lineIndex];
    const isFullyTyped = !isDeleting && charIndex === line.length;
    const delay = isFullyTyped ? 1400 : isDeleting ? 25 : 55;

    const timeout = setTimeout(() => {
      if (isFullyTyped) {
        setIsDeleting(true);
      } else if (!isDeleting) {
        setCharIndex(charIndex + 1);
      } else if (charIndex > 0) {
        setCharIndex(charIndex - 1);
      } else {
        setIsDeleting(false);
        setLineIndex((lineIndex + 1) % lines.length);
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [lines, lineIndex, charIndex, isDeleting]);

  return lines[lineIndex].slice(0, charIndex);
}

function scrollToPrompt(prompt) {
  document.getElementById(promptSections[prompt] || "home")?.scrollIntoView({ behavior: "smooth" });
}

function Hero() {
  const typedText = useTypewriter(taglines);

  return (
    <section className="hero" id="home">
      <div className="hero-inner hero-layout">
        <div className="hero-copy">
          <p className="status-chip">
            <span className="status-dot" aria-hidden="true" />
            Currently: Platform Engineer at Telstra · MSc in ML &amp; AI
          </p>

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
            {socialLinks.map((social) => (
              <a key={social.label} href={social.href} target="_blank" rel="noreferrer" aria-label={social.label}>
                <social.Icon />
              </a>
            ))}
          </div>
        </div>

        <div className="hero-side">
          <div className="hero-photo-wrap">
            <img src="/Krinal_Naghera.jpeg" alt="Krinal Naghera" className="hero-photo" />
          </div>

          <div className="hero-panel">
            <p className="panel-title">What do you want to learn about me?</p>
            <div className="prompt-list">
              {promptOptions.map((prompt) => (
                <button key={prompt} className="prompt-pill" type="button" onClick={() => scrollToPrompt(prompt)}>
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="hero-side">
            <a className="connect-card" href="#contact">
              <span>Connect with me</span>
              <span className="connect-arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
