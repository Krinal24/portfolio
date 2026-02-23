import { useState, useEffect } from "react";
import "./App.css";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { FiSun, FiMoon } from "react-icons/fi";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="app">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-logo">Krinal N</div>

        <div className="nav-links">
          {["Home", "Experience", "Skills", "Education", "Achievements", "Contact"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`}>
              {item}
            </a>
          ))}

          {/* DARK MODE BUTTON */}
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

          <a href="#contact" className="primary-btn">
            Get in touch
          </a>

          <div className="socials">
            <a href="#"><FaGithub /></a>
            <a href="#"><FaLinkedin /></a>
            <a href="#"><SiLeetcode /></a>
          </div>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="hero-center">
          <div className="gradient-rectangle"></div>

          <div className="image-wrapper">
            <img src="/Krinal_Naghera.jpeg" alt="Krinal" />
          </div>
        </div>

      </section>

      <div className="scroll-indicator">⬇</div>

    </div>
  );
}

export default App;