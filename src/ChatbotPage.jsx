import { useEffect, useState } from "react";
import { chatbotContent } from "./constants";
import "./ChatbotPage.css";
import { FiSun, FiMoon } from "react-icons/fi";

function ChatbotPage({ selectedPrompt, onBack, darkMode, setDarkMode }) {
  const promptData = chatbotContent[selectedPrompt] || chatbotContent.Experience;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        sender: "user",
        text: selectedPrompt,
      },
      {
        sender: "bot",
        text: promptData.welcome,
      },
    ]);
  }, [selectedPrompt, promptData]);

  const handleChoice = (option) => {
    const response = promptData.responses[option];

    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: option },
      { sender: "bot", text: response },
    ]);
  };

  return (
    <section className="chatbot-page" id="chatbot">
      <div className="chatbot-shell">
        <nav className="chatbot-navbar">
          <div className="nav-logo">Krinal N</div>

          <div className="nav-links">
            <button type="button" className="nav-link-button" onClick={onBack}>
              Home
            </button>
            <a href="#contact" className="nav-link-anchor">Contact</a>

            <button
              className="theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle dark mode"
              type="button"
            >
              {darkMode ? <FiSun /> : <FiMoon />}
            </button>
          </div>
        </nav>

        <div className="chatbot-header">
          <div>
            <p className="chatbot-kicker">Portfolio AI</p>
            <h2>{selectedPrompt}</h2>
          </div>
        </div>

        <div className="chat-window">
          {messages.map((message, index) => (
            <div
              key={`${message.sender}-${index}`}
              className={`message-row ${message.sender === "user" ? "user" : "bot"}`}
            >
              <div className="message-bubble">{message.text}</div>
            </div>
          ))}
        </div>

        <div className="chat-options">
          {Object.keys(promptData.responses).map((option) => (
            <button
              key={option}
              type="button"
              className="choice-pill"
              onClick={() => handleChoice(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ChatbotPage;
