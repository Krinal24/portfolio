import { useState, useEffect } from "react";
import { experiences } from "./constants";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { FaLinkedin, FaGithub, FaBuilding, FaCarSide } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { FiSun, FiMoon } from "react-icons/fi";
import { BsFillArrowRightCircleFill } from "react-icons/bs";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeExp, setActiveExp] = useState(0);
  const [viewAll, setViewAll] = useState(false);
  const exp = experiences[activeExp];

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="app">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-logo">Krinal N</div>

        <div className="nav-links">
          {["Home", "Experience", "Contact"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`}>
              {item}
            </a>
          ))}

          <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-left">
          <p className="greeting">Hi there 👋</p>

          <h1 className="name">
            I'm <span>Krinal Naghera</span>
          </h1>

          <h2 className="role">
            Software Engineer Associate @ Telstra
          </h2>

          <p className="tagline">
            Building intelligent software solutions that create real impact.
          </p>

          <div className="socials">
            <a href="#"><FaGithub /></a>
            <a href="#"><FaLinkedin /></a>
            <a href="#"><SiLeetcode /></a>
          </div>
        </div>

        <div className="hero-center">
          <div className="gradient-rectangle"></div>
          <div className="image-wrapper">
            <img src="/Krinal_Naghera.jpeg" alt="Krinal" />
          </div>
        </div>

        <div className="scroll-indicator">⬇</div>
      </section>

      {/* EXPERIENCE SECTION */}
      <section className="career-road" id="experience">
        <h2 className="section-title">Experience Journey</h2>

        <p className="road-hint">
          Click milestones to explore my journey across different roles and industries{" "}
          <BsFillArrowRightCircleFill />
        </p>

        {/* TOGGLE BUTTON */}
        <div className="view-toggle-wrapper">
          <button
            className="view-toggle-btn"
            onClick={() => setViewAll(!viewAll)}
          >
            {viewAll ? "Back to Compact View" : "Watch in Road View"}
          </button>
        </div>

        {/* ROAD VIEW */}
        {viewAll && (
          <>
            <div className="road-container">
              <div className="road-line"></div>

              {experiences.map((exp, index) => (
                <div
                  key={index}
                  className={`road-stop ${
                    activeExp === index ? "active" : ""
                  }`}
                  onClick={() => setActiveExp(index)}
                  style={{
                    left: `${(index / (experiences.length - 1)) * 100}%`
                  }}
                >
                  <div className="stop-dot"></div>
                  <p className="company-name">{exp.company}</p>
                  <span className="mini-domain">{exp.domain}</span>
                </div>
              ))}

              <div
                className="car"
                style={{
                  left: `${(activeExp / (experiences.length - 1)) * 100}%`
                }}
              >
                <FaCarSide />
              </div>
            </div>

            {/* SINGLE CARD */}
            <div className="container mt-5">
              <div className="card shadow-lg border-0 experience-card h-100">
  <div className="card-body p-4">

    <div className="row">

      {/* LEFT SIDE */}
      <div className="col-md-5 border-end pe-4">

        <h4 className="company-name mb-2">
          <FaBuilding className="company-icon me-2" />
          {exp.company}
        </h4>

        <h6 className="fw-semibold mb-2">
          {exp.role}
        </h6>

        <p className="text-muted mb-1">
          {exp.duration}
        </p>

        <p className="domain mb-3">
          {exp.domain}
        </p>

        <div>
          {exp.skills.map((skill, i) => (
            <span
              key={i}
              className="badge skill-badge me-2 mb-2"
            >
              {skill}
            </span>
          ))}
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="col-md-7 ps-4 d-flex align-items-center">
        <p className="description mb-0">
          {exp.description}
        </p>
      </div>

    </div>

  </div>
</div>
            </div>
          </>
        )}

        {/* VIEW ALL MODE */}
        {!viewAll && (
          <div className="container mt-5">
            <div className="row">
              {experiences.map((exp, index) => (
                <div key={index} className="col-12 mb-4">
                  <div className="card shadow-lg border-0 experience-card h-100">
                    <div className="card-body p-4">

    <div className="row">

      {/* LEFT SIDE */}
      <div className="col-md-5 border-end pe-4">

        <h4 className="company-name mb-2">
          <FaBuilding className="company-icon me-2" />
          {exp.company}
        </h4>

        <h6 className="fw-semibold mb-2">
          {exp.role}
        </h6>

        <p className="text-muted mb-1">
          {exp.duration}
        </p>

        <p className="domain mb-3">
          {exp.domain}
        </p>

        <div>
          {exp.skills.map((skill, i) => (
            <span
              key={i}
              className="badge skill-badge me-2 mb-2"
            >
              {skill}
            </span>
          ))}
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="col-md-7 ps-4 d-flex align-items-center">
        <p className="description mb-0">
          {exp.description}
        </p>
      </div>

    </div>

  </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;