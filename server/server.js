import http from "node:http";
import { URL } from "node:url";
import * as resumeData from "../src/constants.js";

const port = Number(process.env.PORT || 3001);
const ollamaUrl = process.env.OLLAMA_URL || "http://127.0.0.1:11434";
const ollamaModel = process.env.OLLAMA_MODEL || "career-agent";
const resumeDocuments = createResumeDocuments(resumeData);

const systemPrompt = `You are the portfolio assistant for Krinal Naghera.
Answer only using the supplied portfolio context. The context is the source of truth.
If the context does not contain the answer, say: "I don't have that information in Krinal's portfolio."
Do not answer general knowledge, coding, medical, legal, financial, political, or unrelated questions.
Do not invent employers, dates, projects, metrics, skills, education, or personal details.
Keep answers concise and conversational. Mention uncertainty when the context is ambiguous.`;

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);

  if (request.method === "OPTIONS") {
    response.writeHead(204, { "Access-Control-Allow-Origin": "*" });
    response.end();
    return;
  }

  if (request.method === "GET" && requestUrl.pathname === "/health") {
    sendJson(response, 200, {
      ok: true,
      ollamaUrl,
      model: ollamaModel,
      documents: resumeDocuments.length,
    });
    return;
  }

  if (request.method !== "POST" || requestUrl.pathname !== "/api/chat") {
    sendJson(response, 404, { error: "Not found" });
    return;
  }

  try {
    const body = await readJson(request);
    const question = typeof body.question === "string" ? body.question.trim() : "";

    if (!question || question.length > 2000) {
      sendJson(response, 400, { error: "Question must be between 1 and 2000 characters." });
      return;
    }

    const context = retrieveResumeContext(question);
    const messages = [
      { role: "system", content: `${systemPrompt}\n\nPortfolio context:\n${context}` },
      ...sanitizeHistory(body.history),
      { role: "user", content: question },
    ];

    const ollamaResponse = await fetch(`${ollamaUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: ollamaModel, messages, stream: true }),
    });

    if (!ollamaResponse.ok || !ollamaResponse.body) {
      const detail = await ollamaResponse.text().catch(() => "Ollama did not provide details.");
      sendJson(response, 502, { error: `Ollama request failed: ${detail}` });
      return;
    }

    response.writeHead(200, {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Transfer-Encoding": "chunked",
    });

    await pipeOllamaStream(ollamaResponse.body, response);
  } catch (error) {
    if (!response.headersSent) {
      sendJson(response, 500, { error: error.message || "Unable to process chat request." });
    } else {
      response.end();
    }
  }
});

server.listen(port, () => {
  console.log(`Portfolio API listening on http://localhost:${port}`);
  console.log(`Using Ollama model: ${ollamaModel}`);
});

function createResumeDocuments(data) {
  return Object.entries(data)
    .filter(([name]) => !["taglines", "promptOptions"].includes(name))
    .flatMap(([name, value]) => flattenValue(name, value));
}

function flattenValue(section, value) {
  if (Array.isArray(value)) {
    return value.map((item, index) => ({
      section,
      text: `${section} ${index + 1}: ${serializeValue(item)}`,
    }));
  }

  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, nestedValue]) => (
      flattenValue(`${section} - ${key}`, nestedValue)
    ));
  }

  return typeof value === "string" ? [{ section, text: `${section}: ${value}` }] : [];
}

function serializeValue(value) {
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  if (value && typeof value === "object") {
    return Object.entries(value)
      .map(([key, nestedValue]) => `${key}: ${serializeValue(nestedValue)}`)
      .join(" | ");
  }
  return String(value);
}

function retrieveResumeContext(question) {
  const questionTokens = tokenize(question);
  const rankedDocuments = resumeDocuments
    .map((document) => ({
      ...document,
      score: scoreDocument(document.text, questionTokens),
    }))
    .filter((document) => document.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 6);

  if (!rankedDocuments.length) {
    return "No relevant portfolio context was found.";
  }

  return rankedDocuments.map((document) => `- ${document.text}`).join("\n");
}

function scoreDocument(text, questionTokens) {
  const documentTokens = new Set(tokenize(text));
  return questionTokens.reduce((score, token) => (
    score + (documentTokens.has(token) ? 1 : 0)
  ), 0);
}

function tokenize(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9+#.]+/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !stopWords.has(token));
}

function sanitizeHistory(history) {
  if (!Array.isArray(history)) {
    return [];
  }

  return history.slice(-8).flatMap((message) => {
    if (!message || typeof message.text !== "string") {
      return [];
    }
    return [{
      role: message.sender === "user" ? "user" : "assistant",
      content: message.text.slice(0, 4000),
    }];
  });
}

async function pipeOllamaStream(stream, response) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (!line.trim()) {
        continue;
      }
      const chunk = JSON.parse(line);
      if (chunk.message?.content) {
        response.write(chunk.message.content);
      }
    }

    if (done) {
      break;
    }
  }

  response.end();
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request body is too large."));
        request.destroy();
      }
    });
    request.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        reject(new Error("Request body must be valid JSON."));
      }
    });
    request.on("error", reject);
  });
}

function sendJson(response, status, body) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body));
}

const stopWords = new Set([
  "about", "after", "also", "been", "could", "from", "have", "into", "that", "tell", "this", "what", "when", "where", "which", "with", "would", "your",
]);
