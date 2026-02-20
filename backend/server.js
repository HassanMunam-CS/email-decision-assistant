const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// All available Gemini models in priority order (newest/fastest first)
const MODELS = [
  // Gemini 2.5 (latest generation)
  "gemini-2.5-pro-preview-03-25",
  "gemini-2.5-flash-preview-04-17",
  // Gemini 2.0
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.0-pro-exp-02-05",
  "gemini-2.0-flash-thinking-exp-01-21",
  // Gemini 1.5
  "gemini-1.5-pro",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
];

// Final safety net – returned when every model fails
const FALLBACK = {
  urgency: "IMPORTANT",
  reason: "Fallback triggered after AI model failure.",
  action: "Review manually.",
};

// Strict prompt used for every model attempt
function buildPrompt(subject, body) {
  return `Analyze this email.
Subject: ${subject}
Body: ${body}

Return ONLY a raw JSON object with exactly these keys:
- urgency (URGENT | IMPORTANT | IGNORE)
- reason (1 sentence)
- action (1 sentence)

Do NOT include markdown.
Do NOT include explanations.
Do NOT include text outside JSON.`;
}

// Safely extract a JSON object from the model's raw text response.
// Handles cases where the model wraps JSON in markdown code fences.
function extractJSON(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON object found in model response.");
  return JSON.parse(match[0]);
}

// POST /analyze
app.post("/analyze", async (req, res) => {
  const { subject, body } = req.body;

  // No API key → skip AI entirely
  if (!process.env.GEMINI_API_KEY) {
    console.log("No GEMINI_API_KEY found – using fallback response.");
    return res.json(FALLBACK);
  }

  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const prompt = buildPrompt(subject, body);

  // Try every model in order – first success wins
  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const parsed = extractJSON(text);
      console.log(`✅ Response from ${modelName}`);
      return res.json(parsed);
    } catch (err) {
      console.warn(`⚠️  ${modelName} failed:`, err.message.slice(0, 80));
    }
  }

  // All models exhausted → hardcoded fallback
  console.log("🔴 All models failed – using hardcoded fallback response.");
  return res.json(FALLBACK);
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
