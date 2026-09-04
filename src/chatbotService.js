import { chatbotContent } from "./constants.js";

const stopWords = new Set([
  "about", "also", "are", "can", "did", "do", "does", "for", "have", "how", "is", "me", "my", "tell", "the", "what", "where", "which", "who", "with", "you", "your",
]);

const crossCategoryOptions = {
  Experience: ["Tell me about your projects", "What skills do you have?", "What are your achievements?", "What are you studying now?"],
  Projects: ["What's your current job role?", "What skills do you have?", "What are your achievements?", "What are you studying now?"],
  Skills: ["What's your current job role?", "Tell me about your projects", "What are your achievements?", "What are you studying now?"],
  Education: ["What's your current job role?", "Tell me about your projects", "What skills do you have?", "What are your achievements?"],
  Certifications: ["What's your current job role?", "Tell me about your projects", "What skills do you have?", "What are your achievements?"],
  Achievements: ["What's your current job role?", "Tell me about your projects", "What skills do you have?", "What are you studying now?"],
};

export function getDirectPortfolioAnswer(question, category) {
  const normalizedQuestion = normalize(question);
  if (normalizedQuestion === "learn something else") {
    const currentContent = chatbotContent[category] || chatbotContent.Experience;
    return { answer: currentContent.responses["Learn something else"] || currentContent.welcome, section: category };
  }

  const sectionMatch = Object.entries(chatbotContent).find(([section]) => (
    normalizedQuestion.includes(normalize(section))
  ));

  if (sectionMatch && tokenize(normalizedQuestion).length <= 3) {
    return { answer: sectionMatch[1].welcome, section: sectionMatch[0] };
  }

  const entries = Object.entries(chatbotContent).flatMap(([section, content]) => (
    Object.entries(content.responses).map(([option, answer]) => ({
      section,
      option,
      answer,
      score: scoreQuestion(normalizedQuestion, option, section, category),
    }))
  ));
  const exactMatch = entries.find((entry) => normalize(entry.option) === normalizedQuestion);
  const bestMatch = exactMatch || entries
    .filter((entry) => entry.score >= 2)
    .sort((left, right) => right.score - left.score)[0];

  return bestMatch ? { answer: bestMatch.answer, section: bestMatch.section } : null;
}

export function getSuggestedOptions(question, category) {
  if (normalize(question) === "learn something else") {
    return [...(crossCategoryOptions[category] || []).slice(0, 3), "Learn something else"];
  }

  const categoryOptions = Object.keys(chatbotContent[category]?.responses || {});
  const allOptions = Object.entries(chatbotContent).flatMap(([section, content]) => (
    Object.keys(content.responses).map((option) => ({ option, section }))
  ));
  const normalizedQuestion = normalize(question);
  const rankedOptions = allOptions
    .map((entry) => ({
      ...entry,
      score: scoreQuestion(normalizedQuestion, entry.option, entry.section, category),
    }))
    .sort((left, right) => right.score - left.score);

  const relevantOptions = [...rankedOptions.map((entry) => entry.option), ...categoryOptions]
    .filter((option, index, options) => options.indexOf(option) === index)
    .filter((option) => option !== "Learn something else")
    .slice(0, 3);

  return [...relevantOptions, "Learn something else"];
}

export async function* streamAiAnswer({ question, history, category, signal }) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, history, category, portfolioOnly: true }),
    signal,
  });

  if (!response.ok || !response.body) {
    let detail = "The portfolio assistant could not reach Ollama.";
    try {
      const body = await response.json();
      detail = body.error || detail;
    } catch {
      // Keep the user-facing message stable when the backend is unavailable.
    }
    throw new Error(detail);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }
    yield decoder.decode(value, { stream: true });
  }
}

export async function* streamText(text, signal) {
  for (const word of text.split(" ")) {
    if (signal.aborted) {
      throw new DOMException("The response was aborted.", "AbortError");
    }
    yield `${word} `;
    await new Promise((resolve) => setTimeout(resolve, 16));
  }
}

function scoreQuestion(question, option, section, category) {
  const questionTokens = tokenize(question);
  const optionTokens = new Set(tokenize(option));
  const overlap = questionTokens.reduce((score, token) => (
    score + (optionTokens.has(token) ? 2 : 0)
  ), 0);
  const sectionBonus = questionTokens.includes(normalize(section)) ? 3 : 0;
  const categoryBonus = section === category ? 0.25 : 0;
  return overlap + sectionBonus + categoryBonus;
}

function tokenize(value) {
  return normalize(value)
    .split(" ")
    .filter((token) => token.length > 2 && !stopWords.has(token));
}

function normalize(value) {
  return value.toLowerCase().replace(/[^a-z0-9+#]+/g, " ").trim().replace(/\s+/g, " ");
}
