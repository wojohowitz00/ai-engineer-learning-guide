import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini SDK to prevent startup crashes if GEMINI_API_KEY is initially missing
let aiClient: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables. Please add it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Endpoint: Explain a topic
app.post("/api/gemini/explain", async (req, res, next) => {
  try {
    const { topicTitle, stepTitle } = req.body;
    if (!topicTitle) {
      res.status(400).json({ error: "topicTitle is required" });
      return;
    }

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Explain the topic "${topicTitle}" which is part of the learning step "${stepTitle || ""}". 
Provide a clear, high-quality, professional, and beginner-friendly explanation. 
Include:
1. A brief high-level concept summary.
2. Why it is critical for an AI Engineer (rather than a traditional Data Scientist).
3. A real-world example or practical use case.
4. A small, clean Python code snippet or command-line demonstration showing how to use or configure it.
Format your entire answer beautifully in standard Markdown. Use clear headings, list items, and code blocks.`,
    });

    res.json({ content: response.text });
  } catch (error: any) {
    console.error("Error in /api/gemini/explain:", error);
    res.status(500).json({ error: error.message || "An error occurred while generating explanation." });
  }
});

// Endpoint: Generate a 3-question multiple-choice quiz
app.post("/api/gemini/quiz", async (req, res, next) => {
  try {
    const { topicTitle, topicId } = req.body;
    if (!topicTitle) {
      res.status(400).json({ error: "topicTitle is required" });
      return;
    }

    const ai = getAI();
    const prompt = `Generate a 3-question multiple-choice quiz for the AI Engineering topic "${topicTitle}". 
For each question, provide:
1. A clear, challenging, conceptual question testing knowledge about "${topicTitle}".
2. Exactly 4 distinct multiple-choice options (the user will see these to select from).
3. The 0-based index of the single correct option (integer from 0 to 3).
4. A clear, encouraging, and detailed explanation explaining why that option is correct and why other options are incorrect.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "List of exactly 4 distinct multiple-choice option strings."
                  },
                  correctAnswerIndex: {
                    type: Type.INTEGER,
                    description: "The 0-based index of the correct option (integer from 0 to 3)."
                  },
                  explanation: { type: Type.STRING, description: "Detailed explanation of why this answer is correct." }
                },
                required: ["question", "options", "correctAnswerIndex", "explanation"]
              },
              description: "Array of exactly 3 distinct quiz questions."
            }
          },
          required: ["questions"]
        }
      }
    });

    const quizText = response.text;
    if (!quizText) {
      throw new Error("No text returned from Gemini API");
    }

    const parsedQuiz = JSON.parse(quizText.trim());
    res.json({
      topicId,
      topicTitle,
      questions: parsedQuiz.questions
    });
  } catch (error: any) {
    console.error("Error in /api/gemini/quiz:", error);
    res.status(500).json({ error: error.message || "An error occurred while generating the quiz." });
  }
});

// Endpoint: AI Interview Prep (Chat-based mock interview)
app.post("/api/gemini/interview", async (req, res, next) => {
  try {
    const { topicTitle, messages } = req.body;
    if (!topicTitle) {
      res.status(400).json({ error: "topicTitle is required" });
      return;
    }

    const ai = getAI();
    
    // Format the conversation history for Gemini
    // We expect messages as: { role: "user" | "model", content: string }[]
    const formattedMessages = (messages || []).map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    // If there is no history, seed the conversation with a system prompt
    const systemInstruction = `You are a Lead AI Engineer mock-interviewing a candidate. 
The current topic under discussion is "${topicTitle}".
Your task is to ask challenging technical, design, or behavioral interview questions regarding "${topicTitle}" to test the candidate's proficiency.
Keep your responses professional, constructive, and realistic of an engineering interview.
Always give constructive, actionable feedback on their answers, and follow up with a fresh question, or wind down the interview nicely if it reaches a natural conclusion. 
Format your responses beautifully in Markdown. Do not give away correct answers immediately; guide the candidate.`;

    const lastUserMessage = formattedMessages[formattedMessages.length - 1];

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      // Combine history with system instruction
      contents: formattedMessages,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ content: response.text });
  } catch (error: any) {
    console.error("Error in /api/gemini/interview:", error);
    res.status(500).json({ error: error.message || "An error occurred during mock interview." });
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
