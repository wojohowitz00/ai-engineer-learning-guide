import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import OpenAI from "openai";
import { rateLimit } from "express-rate-limit";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "256kb" }));

// LLM endpoints are metered upstream — cap per-client request rate.
app.use(
  "/api/",
  rateLimit({
    windowMs: 60_000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Log full errors server-side; return only safe, actionable messages to the client.
function respondError(res: express.Response, context: string, error: unknown, fallback: string) {
  console.error(`Error in ${context}:`, error);
  const message =
    error instanceof Error && error.message.startsWith("OPENROUTER_API_KEY")
      ? error.message
      : fallback;
  res.status(500).json({ error: message });
}

function isValidTitle(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= 300;
}

// Models are routed through OpenRouter; override per-deployment without code changes.
// Default is the Auto Router, which picks the best model per prompt.
const MODEL = process.env.OPENROUTER_MODEL || "openrouter/auto";
// The quiz endpoint requires strict json_schema support, which auto-selected
// models are not guaranteed to have — pin it separately if quizzes ever fail.
const QUIZ_MODEL = process.env.OPENROUTER_QUIZ_MODEL || MODEL;
// Cap output per request: bounds cost, and without it OpenRouter pre-checks
// affordability against the routed model's full output window (65k+) — which
// 402s on keys with modest credit limits.
const MAX_OUTPUT_TOKENS = 2048;

// Lazy-initialize the client to prevent startup crashes if OPENROUTER_API_KEY is initially missing
let aiClient: OpenAI | null = null;

function getAI(): OpenAI {
  if (!aiClient) {
    const key = process.env.OPENROUTER_API_KEY;
    if (!key) {
      throw new Error("OPENROUTER_API_KEY is not defined in environment variables. Add it to .env (see .env.example).");
    }
    aiClient = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: key,
      defaultHeaders: {
        "X-OpenRouter-Title": "AI Engineer Learning Guide",
      },
    });
  }
  return aiClient;
}

// Endpoint: Explain a topic
app.post("/api/ai/explain", async (req, res, next) => {
  try {
    const { topicTitle, stepTitle } = req.body;
    if (!isValidTitle(topicTitle)) {
      res.status(400).json({ error: "topicTitle is required (string, max 300 chars)" });
      return;
    }

    const ai = getAI();
    const response = await ai.chat.completions.create({
      model: MODEL,
      max_tokens: MAX_OUTPUT_TOKENS,
      messages: [
        {
          role: "user",
          content: `Explain the topic "${topicTitle}" which is part of the learning step "${isValidTitle(stepTitle) ? stepTitle : ""}".
Provide a clear, high-quality, professional, and beginner-friendly explanation.
Include:
1. A brief high-level concept summary.
2. Why it is critical for an AI Engineer (rather than a traditional Data Scientist).
3. A real-world example or practical use case.
4. A small, clean Python code snippet or command-line demonstration showing how to use or configure it.
Format your entire answer beautifully in standard Markdown. Use clear headings, list items, and code blocks.`,
        },
      ],
    });

    res.json({ content: response.choices[0]?.message?.content ?? "" });
  } catch (error) {
    respondError(res, "/api/ai/explain", error, "An error occurred while generating the explanation.");
  }
});

// Endpoint: Generate a 3-question multiple-choice quiz
app.post("/api/ai/quiz", async (req, res, next) => {
  try {
    const { topicTitle, topicId } = req.body;
    if (!isValidTitle(topicTitle)) {
      res.status(400).json({ error: "topicTitle is required (string, max 300 chars)" });
      return;
    }

    const ai = getAI();
    const prompt = `Generate a 3-question multiple-choice quiz for the AI Engineering topic "${topicTitle}".
For each question, provide:
1. A clear, challenging, conceptual question testing knowledge about "${topicTitle}".
2. Exactly 4 distinct multiple-choice options (the user will see these to select from).
3. The 0-based index of the single correct option (integer from 0 to 3).
4. A clear, encouraging, and detailed explanation explaining why that option is correct and why other options are incorrect.`;

    const response = await ai.chat.completions.create({
      model: QUIZ_MODEL,
      max_tokens: MAX_OUTPUT_TOKENS,
      messages: [{ role: "user", content: prompt }],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "quiz",
          strict: true,
          schema: {
            type: "object",
            properties: {
              questions: {
                type: "array",
                description: "Array of exactly 3 distinct quiz questions.",
                items: {
                  type: "object",
                  properties: {
                    question: { type: "string" },
                    options: {
                      type: "array",
                      items: { type: "string" },
                      description: "List of exactly 4 distinct multiple-choice option strings."
                    },
                    correctAnswerIndex: {
                      type: "integer",
                      description: "The 0-based index of the correct option (integer from 0 to 3)."
                    },
                    explanation: { type: "string", description: "Detailed explanation of why this answer is correct." }
                  },
                  required: ["question", "options", "correctAnswerIndex", "explanation"],
                  additionalProperties: false
                }
              }
            },
            required: ["questions"],
            additionalProperties: false
          }
        }
      }
    });

    const quizText = response.choices[0]?.message?.content;
    if (!quizText) {
      throw new Error("No text returned from the model");
    }

    const parsedQuiz = JSON.parse(quizText.trim());
    res.json({
      topicId,
      topicTitle,
      questions: parsedQuiz.questions
    });
  } catch (error) {
    respondError(res, "/api/ai/quiz", error, "An error occurred while generating the quiz.");
  }
});

// Endpoint: AI Interview Prep (Chat-based mock interview)
app.post("/api/ai/interview", async (req, res, next) => {
  try {
    const { topicTitle, messages } = req.body;
    if (!isValidTitle(topicTitle)) {
      res.status(400).json({ error: "topicTitle is required (string, max 300 chars)" });
      return;
    }
    if (messages !== undefined && !Array.isArray(messages)) {
      res.status(400).json({ error: "messages must be an array" });
      return;
    }

    const ai = getAI();

    const systemInstruction = `You are a Lead AI Engineer mock-interviewing a candidate.
The current topic under discussion is "${topicTitle}".
Your task is to ask challenging technical, design, or behavioral interview questions regarding "${topicTitle}" to test the candidate's proficiency.
Keep your responses professional, constructive, and realistic of an engineering interview.
Always give constructive, actionable feedback on their answers, and follow up with a fresh question, or wind down the interview nicely if it reaches a natural conclusion.
Format your responses beautifully in Markdown. Do not give away correct answers immediately; guide the candidate.`;

    // Client sends messages as { role: "user" | "assistant", content: string }[].
    // Client history is untrusted: keep only the last 40 turns, cap each turn's
    // length, and coerce roles so nothing else reaches the model.
    const history = (messages || [])
      .slice(-40)
      .map((m: any) => ({
        role: m?.role === "assistant" ? ("assistant" as const) : ("user" as const),
        content: String(m?.content ?? "").slice(0, 8000),
      }));

    const response = await ai.chat.completions.create({
      model: MODEL,
      max_tokens: MAX_OUTPUT_TOKENS,
      messages: [{ role: "system", content: systemInstruction }, ...history],
      temperature: 0.7,
    });

    res.json({ content: response.choices[0]?.message?.content ?? "" });
  } catch (error) {
    respondError(res, "/api/ai/interview", error, "An error occurred during the mock interview.");
  }
});

// Set up server environment: static file rendering in production vs Vite in dev
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode serving static assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
