import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import "./base.css";
import "./App.css";
import ChatbotPage from "./ChatbotPage";
import CustomCursor from "./components/CustomCursor";
import SiteNav from "./components/SiteNav";
import Hero from "./components/Hero";
import ImpactStats from "./components/ImpactStats";
import ExperienceSection from "./components/ExperienceSection";
import ProjectsSection from "./components/ProjectsSection";
import CapabilitySection from "./components/CapabilitySection";
import CertificatesSection from "./components/CertificatesSection";
import EducationSection from "./components/EducationSection";
import FunSection from "./components/FunSection";
import SiteFooter from "./components/SiteFooter";
import { useScrollReveal } from "./hooks/useScrollReveal";

function Portfolio({ darkMode, onToggleTheme }) {
  const contentRef = useScrollReveal();

  return (
    <>
      <SiteNav darkMode={darkMode} onToggleTheme={onToggleTheme} />
      <Hero />
      <main className="portfolio-content" ref={contentRef}>
        <ImpactStats />
        <ExperienceSection />
        <ProjectsSection />
        <CapabilitySection />
        <CertificatesSection />
        <EducationSection />
        <FunSection />
      </main>
      <SiteFooter />
    </>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(false);
  // Not reachable from the page yet: nothing sets a prompt. Kept until we decide on the AI chat.
  const [selectedPrompt, setSelectedPrompt] = useState(null);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="app">
      <CustomCursor />
      {selectedPrompt ? (
        <ChatbotPage
          selectedPrompt={selectedPrompt}
          onBack={() => setSelectedPrompt(null)}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      ) : (
        <Portfolio darkMode={darkMode} onToggleTheme={() => setDarkMode((value) => !value)} />
      )}
      <Analytics />
    </div>
  );
}

export default App;
