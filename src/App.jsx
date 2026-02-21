import "./App.css";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";

function App() {
  return (
    <div className="app">

      {/* Logo */}
      <div className="logo">Krinal N</div>


      <section className="hero">

  {/* LEFT */}
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
      {/* icons here */}
    </div>
  </div>

  {/* CENTER (PHOTO) */}
  <div className="hero-center">
    <div className="gradient-rectangle"></div>
    <div className="image-wrapper">
      <img src="/Krinal_Naghera.jpeg" alt="Krinal" />
    </div>
  </div>

  {/* RIGHT TEXT NAV */}
  <div className="hero-nav">
    {["Home", "Experience", "Skills", "Education", "Achievements", "Contact"].map((item) => (
      <a key={item} href={`#${item.toLowerCase()}`}>
        {item}
      </a>
    ))}
  </div>

</section>

      <div className="scroll-indicator" aria-label="scroll down">⬇</div>

    </div>
  );
}

export default App;