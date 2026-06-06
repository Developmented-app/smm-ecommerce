import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of Gemini client to prevent crash on startup if key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is verify-required but not yet declared/set in environment variable setup.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// REST route to analyze provided URL & suggest best SMM quantity based on parameters
app.post("/api/gemini/analyze-url", async (req, res) => {
  try {
    const { url, category, serviceName } = req.body;

    if (!url || !url.trim()) {
      return res.status(400).json({ error: "A target URL or user reference is required." });
    }

    const ai = getGeminiClient();

    const prompt = `
      You are an expert Social Media Viral Marketer and SMM Panel consultant.
      Analyze the following social media campaign reference:
      - Target destination: ${url}
      - Platform category: ${category}
      - Package / Service selected: ${serviceName || "None"}

      Analyze what type of content or target this is based on the URL (e.g. profile handle, video post, image share, channel)
      and suggest the single most effective, organic-looking SMM product quantity (usually between 200 and 5000 units depending on organic scaling factors) to maximize retention, spark algorithmic boost cycles (likes/views loop), and secure viral organic engagement. 

      Provide current social search trends or algorithm recommendations matching this specific content medium.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedQuantity: {
              type: Type.INTEGER,
              description: "The suggested SMM quantity (e.g., 500, 1000, 2500) as an integer.",
            },
            analysis: {
              type: Type.STRING,
              description: "Brief professional analysis with market-trend justification and engagement advice (2-3 sentences max).",
            },
            confidence: {
              type: Type.NUMBER,
              description: "Confidence level of suggestions (0.0 to 1.0).",
            },
            trendKeywords: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
              description: "2-3 trending SMM keywords or hashtag strategies (e.g., #GrowthLoop, #MicroNicheHook).",
            },
          },
          required: ["suggestedQuantity", "analysis", "confidence", "trendKeywords"],
        },
      },
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("No response string produced by Gemini API.");
    }

    const result = JSON.parse(textOutput.trim());
    return res.json(result);
  } catch (error: any) {
    console.error("Gemini SMM analysis error:", error);
    return res.status(500).json({
      error: error.message || "Failed to analyze target URL utilizing SMM heuristics.",
    });
  }
});

// Start integration server
async function bootstrap() {
  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server environment running on Port http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Bootstrap server error:", err);
});
