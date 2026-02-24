import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { FaLinkedin, FaGithub, FaBuilding, FaCarSide } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { FiSun, FiMoon } from "react-icons/fi";
import { BsFillArrowRightCircleFill } from "react-icons/bs";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeExp, setActiveExp] = useState(0);
  const [viewAll, setViewAll] = useState(false); // 🔥 NEW STATE

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const experiences = [
    {
      company: "Telstra",
      role: "Associate Software Engineer",
      duration: "(July 2025 – Present)",
      domain: "Enterprise Telecom | Network Digitisation",
      description:
        "Designing and delivering scalable backend microservices powering enterprise-grade broadband personalization platforms. I work extensively on distributed event-driven systems using Kafka and Camunda workflow orchestration.",
      skills: ["Java", "Microservices", "Kafka", "Camunda", "Angular", "CI/CD"]
    },
    {
      company: "MathCo",
      role: "Data Engineer Intern",
      duration: "(Jan 2025 – July 2025)",
      domain: "Healthcare Analytics | Data Engineering",
      description:
        "Built optimized ETL pipelines and predictive analytics solutions for pharmaceutical referral optimization. Improved alert efficiency and reduced operational costs.",
      skills: ["Python", "SQL", "ETL", "Machine Learning", "Data Pipelines"]
    },
    {
      company: "NYXify Technologies",
      role: "AI Intern",
      duration: "(Mar 2024 – May 2024)",
      domain: "Generative AI | LLM Systems",
      description:
        "Worked on LLM dataset preparation, evaluation benchmarking, and prompt engineering strategies to enhance AI performance.",
      skills: ["LLMs", "Prompt Engineering", "NLP", "AI Evaluation"]
    },
    {
      company: "Altigreen Propulsion Labs",
      role: "Data Intern",
      duration: "(Sep 2023 – Oct 2023)",
      domain: "EV Analytics | Edge Data",
      description:
        "Analyzed large-scale EV telemetry datasets to improve predictive performance modeling and built dashboards for real-time insights.",
      skills: ["Python", "Machine Learning", "Data Visualization", "Analytics"]
    }
  ];

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

        {/* 🔥 TOGGLE BUTTON */}
          <div className="view-toggle-wrapper">
            <button
              className="view-toggle-btn"
              onClick={() => setViewAll(!viewAll)}
            >
              {viewAll ? "Back to Road View" : "View All at Once?"}
            </button>
          </div>

        {/* 🚗 ROAD ONLY SHOWS IF NOT VIEW ALL */}
        {!viewAll && (
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
        )}

        <div className="container mt-5">
          {/* 🔥 SINGLE CARD MODE */}
          {!viewAll && (
            <div className="card shadow-lg border-0 experience-card">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <FaBuilding className="company-icon me-2" />
                  <h3 className="mb-0">
                    {experiences[activeExp].company}
                  </h3>
                </div>

                <h5 className="fw-semibold">
                  {experiences[activeExp].role}
                </h5>

                <p className="domain">
                  {experiences[activeExp].duration}
                </p>

                <p className="domain">
                  {experiences[activeExp].domain}
                </p>

                <p>{experiences[activeExp].description}</p>

                <div className="mt-3">
                  {experiences[activeExp].skills.map((skill, i) => (
                    <span key={i} className="badge skill-badge me-2 mb-2">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 🔥 VIEW ALL MODE */}
          {viewAll && (
  <div className="row mt-4">
    {experiences.map((exp, index) => (
      <div key={index} className="col-md-6 mb-4">
        <div className="card shadow-lg border-0 experience-card h-100">
          <div className="card-body p-4">

            <div className="d-flex align-items-center mb-3">
              <FaBuilding className="company-icon me-2" />
              <h4 className="mb-0">{exp.company}</h4>
            </div>

            <h6 className="fw-semibold">{exp.role}</h6>

            <p className="domain mb-1">{exp.duration}</p>
            <p className="domain mb-3">{exp.domain}</p>

            <p className="description">{exp.description}</p>

            <div className="mt-3">
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
        </div>
      </div>
    ))}
  </div>
)}

          
        </div>
      </section>
    </div>
  );
}

export default App;