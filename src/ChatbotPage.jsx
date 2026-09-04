import { useEffect, useRef, useState } from "react";
import { chatbotContent } from "./constants";
import "./ChatbotPage.css";
import { FiSun, FiMoon } from "react-icons/fi";
import { getDirectPortfolioAnswer, getSuggestedOptions, streamAiAnswer, streamText } from "./chatbotService";

function ChatbotPage({ selectedPrompt, onBack, darkMode, setDarkMode }) {
  const promptData = chatbotContent[selectedPrompt] || chatbotContent.Experience;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [options, setOptions] = useState(Object.keys(promptData.responses));
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef(null);
  const chatWindowRef = useRef(null);

  useEffect(() => {
    abortControllerRef.current?.abort();
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
    setOptions(Object.keys(promptData.responses));
    setInput("");
    setIsStreaming(false);
  }, [selectedPrompt, promptData]);

  useEffect(() => {
    chatWindowRef.current?.scrollTo({
      top: chatWindowRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSubmit = async (event, submittedText = input) => {
    event?.preventDefault();
    const question = submittedText.trim();

    if (!question || isStreaming) {
      return;
    }

    abortControllerRef.current?.abort();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    setInput("");
    const directAnswer = getDirectPortfolioAnswer(question, selectedPrompt);

    if (directAnswer) {
      setIsStreaming(true);
      setOptions([]);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: question },
        { sender: "bot", text: "", streaming: true },
      ]);

      let answer = "";
      for await (const chunk of streamText(directAnswer.answer, abortController.signal)) {
        answer += chunk;
        setMessages((prevMessages) => prevMessages.map((message, index) => (
          index === prevMessages.length - 1 ? { ...message, text: answer } : message
        )));
      }
      setOptions(getSuggestedOptions(question, directAnswer.section));
      setIsStreaming(false);
      return;
    }

    setIsStreaming(true);
    setOptions([]);
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: question },
      { sender: "bot", text: "Thinking...", streaming: true },
    ]);

    try {
      let answer = "";
      for await (const chunk of streamAiAnswer({
        question,
        history: messages,
        category: selectedPrompt,
        signal: abortController.signal,
      })) {
        answer += chunk;
        setMessages((prevMessages) => prevMessages.map((message, index) => (
          index === prevMessages.length - 1 ? { ...message, text: answer } : message
        )));
      }
      setOptions(getSuggestedOptions(question, selectedPrompt));
    } catch (error) {
      if (error.name !== "AbortError") {
        setMessages((prevMessages) => prevMessages.map((message, index) => (
          index === prevMessages.length - 1
            ? { ...message, text: error.message || "I could not get a response from the portfolio assistant.", error: true }
            : message
        )));
        setOptions(Object.keys(promptData.responses));
      }
    } finally {
      if (abortControllerRef.current === abortController) {
        setIsStreaming(false);
      }
    }
  };

  const handleChoice = (option) => handleSubmit(null, option);

  return (
    <section className="chatbot-page" id="chatbot">
      <nav className="navbar chatbot-navbar">
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

      <div className="chatbot-shell">
        <div className="chatbot-header">
          <div>
            <p className="chatbot-kicker">Portfolio AI</p>
            <h2>{selectedPrompt}</h2>
          </div>
        </div>

        <div className="chat-window" ref={chatWindowRef}>
          {messages.map((message, index) => (
            <div
              key={`${message.sender}-${index}`}
              className={`message-row ${message.sender === "user" ? "user" : "bot"}`}
            >
              <div className={`message-bubble ${message.error ? "message-error" : ""}`}>
                {message.text}
                {message.streaming && isStreaming && <span className="streaming-cursor" aria-label="Generating response" />}
              </div>
            </div>
          ))}
        </div>

        <div className="chat-composer">
          <form className="chat-input-row" onSubmit={handleSubmit}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about my portfolio..."
              aria-label="Ask about the portfolio"
              disabled={isStreaming}
            />
            <button type="submit" disabled={!input.trim() || isStreaming}>
              {isStreaming ? "Thinking..." : "Ask"}
            </button>
          </form>

          <div className="chat-options" aria-label="Suggested questions">
          {options.map((option) => (
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
      </div>
    </section>
  );
}

export default ChatbotPage;
