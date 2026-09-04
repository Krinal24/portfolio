import { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { certificateItems, education, experiences, projects, taglines, promptOptions } from "./constants";
import ChatbotPage from "./ChatbotPage";

import { FaBook, FaGithub, FaLinkedin, FaSpotify } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { FiSun, FiMoon } from "react-icons/fi";

const capabilityLanes = {
  "Reliable Systems": {
    eyebrow: "Production-minded engineering",
    description: "I make complex platforms easier to scale, operate, and understand when things get noisy.",
    proof: "1000+ applications brought into a more consistent observability practice at Telstra, with incident detection improved by 30-40%.",
    skills: ["OpenTelemetry", "New Relic", "Splunk", "SLIs/SLOs", "Distributed Tracing", "Kubernetes", "Terraform", "GitLab CI/CD", "Docker", "Google Cloud (GCP)", "AWS"],
  },
  "Intelligent Products": {
    eyebrow: "AI with a job to do",
    description: "I connect machine learning and retrieval systems to experiences that help people learn or decide.",
    proof: "SmartLearnX combines Gemini, RAG pipelines, LangChain, and vector search.",
    skills: ["MCP", "TensorFlow", "PyTorch", "MLflow", "Generative AI", "RAG", "LangChain", "Agentic AI"],
  },
  "Data in Motion": {
    eyebrow: "From raw data to signal",
    description: "I turn large, messy datasets into pipelines, predictions, and decisions teams can use.",
    proof: "Improved data accuracy by 45% at MathCo and predictive accuracy by 15% at Altigreen.",
    skills: ["Python", "PySpark", "Scala", "SQL", "Databricks", "Apache Airflow", "Data Engineering Pipelines"],
  },
  "Code & Architecture": {
    eyebrow: "Backend systems with structure",
    description: "I design maintainable services and APIs that reduce coupling while keeping room for the next feature.",
    proof: "Built Java Spring Boot microservices and dedicated read/write APIs for a Telstra Enterprise client portal.",
    skills: ["Java", "Spring Boot", "Microservices", "REST APIs", "Power Automate"],
  },
  "Product Experiences": {
    eyebrow: "Interfaces that make systems useful",
    description: "I bring engineering depth into the product surface, from responsive interfaces to AI-powered learning flows.",
    proof: "SmartLearnX turns retrieval pipelines into personalized learning paths and customized educational content.",
    skills: ["React", "Next.js"],
  },
  "Communication & Leadership": {
    eyebrow: "Technical work is also people work",
    description: "I communicate clearly, document thoughtfully, and create communities where people can learn and contribute.",
    proof: "Led clubs and served in Toastmasters International, including establishing NMIT Toastmasters Club and serving as President from July to December 2024.",
    skills: ["Technical Communication", "Content & Documentation", "Community Leadership", "Public Speaking", "Club Leadership"],
  },
};

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHoveringLink, setIsHoveringLink] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [selectedCapability, setSelectedCapability] = useState(Object.keys(capabilityLanes)[0]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [bugScore, setBugScore] = useState(0);
  const [bugPosition, setBugPosition] = useState({ top: 42, left: 54 });
  const [bugEscaped, setBugEscaped] = useState(false);
  const portfolioContentRef = useRef(null);
  const certificateTrackRef = useRef(null);
  const certificateWheelVelocityRef = useRef(0);

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

  useEffect(() => {
    const content = portfolioContentRef.current;
    if (!content || !("IntersectionObserver" in window)) {
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });

    content.querySelectorAll(".scroll-reveal").forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [selectedPrompt]);

  useEffect(() => {
    const track = certificateTrackRef.current;
    if (!track) return undefined;

    let position = 0;
    let lastTime = performance.now();
    let animationFrame;

    const animateCertificates = (time) => {
      const elapsed = Math.min(time - lastTime, 40);
      const wheelVelocity = certificateWheelVelocityRef.current;
      const velocity = -24 + wheelVelocity;
      const loopWidth = track.scrollWidth / 2;

      position += (velocity * elapsed) / 1000;
      certificateWheelVelocityRef.current *= Math.pow(0.08, elapsed / 1000);

      if (loopWidth > 0) {
        if (position <= -loopWidth) position += loopWidth;
        if (position >= 0) position -= loopWidth;
      }

      track.style.transform = `translate3d(${position}px, 0, 0)`;
      lastTime = time;
      animationFrame = requestAnimationFrame(animateCertificates);
    };

    animationFrame = requestAnimationFrame(animateCertificates);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const handleCertificateWheel = (event) => {
    const horizontalDelta = event.deltaX || (event.shiftKey ? event.deltaY : 0);
    if (!horizontalDelta) return;

    const fingerDirectionDelta = -horizontalDelta;
    certificateWheelVelocityRef.current = Math.max(
      -360,
      Math.min(360, certificateWheelVelocityRef.current + fingerDirectionDelta * 2.4),
    );
  };

  const handlePromptClick = (prompt) => {
    const sectionMap = {
      Experience: "experience",
      Projects: "projects",
      Skills: "skills",
      Education: "education",
      Certifications: "certifications",
      Achievements: "fun",
    };
    const section = document.getElementById(sectionMap[prompt] || "home");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  const resetToHome = () => {
    setSelectedPrompt(null);
  };

  const catchTheBug = () => {
    setBugScore((score) => score + 1);
    setBugEscaped(false);
    setBugPosition({
      top: 12 + Math.random() * 68,
      left: 8 + Math.random() * 82,
    });
  };

  const handleBugArenaMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const cursorLeft = ((event.clientX - bounds.left) / bounds.width) * 100;
    const cursorTop = ((event.clientY - bounds.top) / bounds.height) * 100;
    const horizontalDistance = bugPosition.left - cursorLeft;
    const verticalDistance = bugPosition.top - cursorTop;
    const distance = Math.hypot(horizontalDistance, verticalDistance);

    if (distance > 19) return;

    const safeDistance = distance || 1;
    const escapeStrength = 15 + Math.random() * 10;
    setBugEscaped(true);
    setBugPosition({
      left: Math.max(8, Math.min(92, bugPosition.left + (horizontalDistance / safeDistance) * escapeStrength)),
      top: Math.max(14, Math.min(84, bugPosition.top + (verticalDistance / safeDistance) * escapeStrength)),
    });
  };

  const resetBugGame = () => {
    setBugScore(0);
    setBugEscaped(false);
    setBugPosition({ top: 42, left: 54 });
  };

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

      {selectedPrompt ? (
        <ChatbotPage
          selectedPrompt={selectedPrompt}
          onBack={resetToHome}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      ) : (
        <>
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
                  {promptOptions.map((prompt) => (
                    <button
                      key={prompt}
                      className="prompt-pill"
                      type="button"
                      onClick={() => handlePromptClick(prompt)}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>

                <button type="button" className="connect-card" aria-label="Connect with me">
                  <span>Connect with me</span>
                  <span className="connect-arrow">→</span>
                </button>
              </div>
            </div>
          </section>

          <main className="portfolio-content" ref={portfolioContentRef}>
            <section className="portfolio-section experience-section" id="experience">
              <div className="section-heading">
                <div>
                  <p className="section-kicker">The path so far</p>
                  <h2>Experience</h2>
                </div>
                <p className="section-intro">
                  Building dependable systems, useful data products, and better ways to understand what is happening in production.
                </p>
              </div>

              <div className="experience-list">
                {experiences.map((experience, index) => (
                  <article className="experience-item scroll-reveal" key={`${experience.company}-${experience.role}`}>
                    <div className="experience-marker" aria-hidden="true">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <div className="experience-main">
                      <div className="experience-meta">
                        <p className="experience-duration">{experience.duration}</p>
                        <p className="experience-domain">{experience.domain}</p>
                      </div>
                      <h3>{experience.role}</h3>
                      <p className="experience-company">{experience.company}</p>
                      <p className="experience-description">{experience.description}</p>
                      <div className="skill-tags">
                        {experience.skills.map((skill) => <span key={skill}>{skill}</span>)}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="portfolio-section projects-section" id="projects">
              <div className="section-heading projects-heading">
                <div>
                  <p className="section-kicker">Selected work</p>
                  <h2>Projects</h2>
                </div>
                <p className="section-intro">
                  Small, focused systems where machine learning meets thoughtful product experiences.
                </p>
              </div>

              <div className="project-grid">
                {projects.map((project, index) => (
                  <article className={`project-card project-card-${index + 1} scroll-reveal`} key={project.name}>
                    <div className="project-card-topline">
                      <span className="project-index">0{index + 1}</span>
                      <span className="project-type">AI & ML</span>
                    </div>
                    <h3>{project.name}</h3>
                    {project.highlight && <p className="project-highlight">{project.highlight}</p>}
                    <p>{project.description}</p>
                    <div className="project-footer">
                      <div className="skill-tags">
                        {project.technologies.map((technology) => <span key={technology}>{technology}</span>)}
                      </div>
                      {project.link && <a href={project.link} target="_blank" rel="noreferrer">View project <span aria-hidden="true">↗</span></a>}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="portfolio-section skills-section" id="skills">
              <div className="section-heading skills-heading">
                <div>
                  <p className="section-kicker">The working toolkit</p>
                  <h2>Capability map</h2>
                </div>
                <p className="section-intro">
                  Choose a lane to see the skills, working style, and evidence behind how I build.
                </p>
              </div>

              <div className="capability-board">
                <div className="capability-tabs" role="tablist" aria-label="Capability lanes">
                  {Object.keys(capabilityLanes).map((lane) => (
                    <button
                      className={`capability-tab ${selectedCapability === lane ? "is-selected" : ""}`}
                      key={lane}
                      type="button"
                      role="tab"
                      aria-selected={selectedCapability === lane}
                      onClick={() => setSelectedCapability(lane)}
                    >
                      <span className="capability-tab-number">0{Object.keys(capabilityLanes).indexOf(lane) + 1}</span>
                      {lane}
                    </button>
                  ))}
                </div>

                <div className="capability-panel" role="tabpanel" aria-live="polite">
                  <div className="capability-copy">
                    <p className="capability-eyebrow">{capabilityLanes[selectedCapability].eyebrow}</p>
                    <h3>{selectedCapability}</h3>
                    <p>{capabilityLanes[selectedCapability].description}</p>
                    <div className="capability-proof">
                      <span>Proof point</span>
                      <strong>{capabilityLanes[selectedCapability].proof}</strong>
                    </div>
                  </div>
                  <div className="capability-skills">
                    <span className="capability-skills-label">Skills in this lane</span>
                    {capabilityLanes[selectedCapability].skills.map((skill, index) => (
                      <span
                        className="capability-skill"
                        style={{
                          "--cloud-index": index,
                          "--cloud-scale": 0.94 + ((index % 4) * 0.035),
                        }}
                        key={skill}
                        onMouseMove={handleSkillCloudMove}
                        onMouseLeave={handleSkillCloudLeave}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="portfolio-section certificates-section" id="certifications">
              <div className="section-heading certificates-heading">
                <div>
                  <p className="section-kicker">Proof of practice</p>
                  <h2>Certificates &amp; acknowledgements</h2>
                </div>
                <p className="section-intro">
                  A moving archive of the learning, recognition, and communities that have shaped my work.
                </p>
              </div>

              <div
                className="certificate-marquee"
                aria-label="Certificates and acknowledgements"
                onWheel={handleCertificateWheel}
              >
                <div className="certificate-track" ref={certificateTrackRef}>
                  {[...certificateItems, ...certificateItems].map((certificate, index) => (
                    <button
                      className="certificate-card"
                      key={`${certificate.title}-${index}`}
                      type="button"
                      onClick={() => setSelectedCertificate(certificate)}
                      aria-label={`View ${certificate.title}`}
                    >
                      <span className="certificate-image-wrap">
                        <img
                          src={certificate.image}
                          alt=""
                          onError={(event) => {
                            event.currentTarget.hidden = true;
                            event.currentTarget.nextElementSibling.hidden = false;
                          }}
                        />
                        <span className="certificate-placeholder" hidden aria-hidden="true">Add image</span>
                      </span>
                      <span className="certificate-type">{certificate.type}</span>
                      <strong>{certificate.title}</strong>
                      <span className="certificate-open">View <span aria-hidden="true">↗</span></span>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {selectedCertificate && (
              <div className="certificate-modal-backdrop" role="presentation" onClick={() => setSelectedCertificate(null)}>
                <div className="certificate-modal" role="dialog" aria-modal="true" aria-label={selectedCertificate.title} onClick={(event) => event.stopPropagation()}>
                  <button className="certificate-modal-close" type="button" onClick={() => setSelectedCertificate(null)} aria-label="Close certificate preview">×</button>
                  <img src={selectedCertificate.image} alt={selectedCertificate.title} />
                  <p>{selectedCertificate.type}</p>
                  <h3>{selectedCertificate.title}</h3>
                </div>
              </div>
            )}

            <section className="portfolio-section education-section" id="education">
              <div className="section-heading">
                <div>
                  <p className="section-kicker">The foundation</p>
                  <h2>Education</h2>
                </div>
                <p className="section-intro">
                  A computer science foundation growing into deeper work in machine learning and AI.
                </p>
              </div>

              <div className="education-list">
                {education.map((item, index) => (
                  <article className="education-item" key={item.institution}>
                    <span className="education-number">0{index + 1}</span>
                    <div>
                      <p className="education-duration">{item.duration}</p>
                      <h3>{item.degree}</h3>
                      <p className="education-institution">{item.institution}</p>
                      <p className="education-result">{item.grade}{item.location ? ` · ${item.location}` : ""}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="portfolio-section fun-section" id="fun">
              <div className="section-heading">
                <div>
                  <p className="section-kicker">Outside the stack</p>
                  <h2>Fun corner</h2>
                </div>
                <p className="section-intro">
                  A little space for curiosity, conversation, music, and the ideas that keep the work human. Warning: this section contains one extremely unserious bug.
                </p>
              </div>

              <div className="fun-grid">
                <article className="fun-card ama-card">
                  <span className="fun-card-label">01 / AMA</span>
                  <h3>Ask me anything.</h3>
                  <p>Want to talk about engineering, AI, learning, or build a project in AI, ML or Data with me? Send me a note or reach out on LinkedIn.</p>
                  <div className="fun-links">
                    <a href="mailto:hello@krinalnaghera.dev">Email me <span aria-hidden="true">↗</span></a>
                    <a href="https://www.linkedin.com/in/krinal-naghera/" target="_blank" rel="noreferrer">DM on LinkedIn <span aria-hidden="true">↗</span></a>
                  </div>
                </article>

                <article className="fun-card culture-card">
                  <span className="fun-card-label">02 / Currently into</span>
                  <div className="fun-item">
                    <span className="fun-symbol spotify-symbol" aria-hidden="true"><FaSpotify /></span>
                    <div>
                      <span>Favourite song</span>
                      <a href="https://open.spotify.com/track/35KiiILklye1JRRctaLUb4" target="_blank" rel="noreferrer">Holocene · Bon Iver ↗</a>
                    </div>
                  </div>
                  <div className="fun-item quote-item">
                    <span className="fun-symbol book-symbol" aria-hidden="true"><FaBook /></span>
                    <div>
                      <span>Favourite quote</span>
                      <blockquote>“And now that you don’t have to be perfect, you can be good.”</blockquote>
                      <cite>East of Eden · John Steinbeck</cite>
                    </div>
                  </div>
                </article>

                <article className="fun-card bug-card">
                  <div className="bug-card-heading">
                    <span className="fun-card-label">03 / Production incident</span>
                    <span className="bug-score">Bugs caught: {bugScore}</span>
                  </div>
                  <h3>Catch the bug.</h3>
                  <p>It escaped code review and is now hiding somewhere in this tiny production environment. Click it before it asks for a promotion.</p>
                  <div className="bug-arena" aria-label="Mini game: catch the bug" onMouseMove={handleBugArenaMove}>
                    <button
                      className="bug-target"
                      type="button"
                      style={{ top: `${bugPosition.top}%`, left: `${bugPosition.left}%` }}
                      onClick={catchTheBug}
                      aria-label="Catch the bug"
                    >
                      <span aria-hidden="true">🐛</span>
                    </button>
                    <span className="bug-status">
                      {bugEscaped ? "The bug filed a remote-work request." : bugScore > 4 ? "Senior bug hunter unlocked." : "Status: suspiciously operational"}
                    </span>
                  </div>
                  <button className="bug-reset" type="button" onClick={resetBugGame}>Reset incident</button>
                </article>
              </div>
            </section>
          </main>
        </>
      )}
    </div>
  );
}

function handleSkillCloudMove(event) {
  const bounds = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - bounds.left - bounds.width / 2) / 5;
  const y = (event.clientY - bounds.top - bounds.height / 2) / 5;
  event.currentTarget.style.setProperty("--cloud-x", `${x}px`);
  event.currentTarget.style.setProperty("--cloud-y", `${y}px`);
}

function handleSkillCloudLeave(event) {
  event.currentTarget.style.setProperty("--cloud-x", "0px");
  event.currentTarget.style.setProperty("--cloud-y", "0px");
}

export default App;