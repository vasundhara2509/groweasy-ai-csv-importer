const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Initialize Groq client
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// Home Route
app.get("/", (req, res) => {
  res.send("🚀 GrowEasy Backend is Running");
});

// Test AI Route
app.get("/test-ai", async (req, res) => {
  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: "Reply only with: Groq connection successful",
        },
      ],
    });

    res.json({
      success: true,
      message: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("TEST AI ERROR:");
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// CSV Import Route
app.post("/import", async (req, res) => {
  try {
    const { data } = req.body;

    console.log("\n==============================");
    console.log("CSV RECEIVED");
    console.log("==============================");
    console.log(data);

    const prompt = `
You are an AI CRM Lead Scoring Assistant.

Analyze each lead and provide:

- Name
- Company
- Lead Score (0-100)
- Category (Hot/Warm/Cold)
- Reason

Return the response in JSON array format only.

Leads:

${JSON.stringify(data)}
`;

    console.log("\nSending request to Groq...\n");

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
    });

    console.log("\n========== GROQ RESPONSE ==========");
    console.log(JSON.stringify(completion, null, 2));

    const aiResponse = completion.choices[0].message.content;

    console.log("\n========== AI CONTENT ==========");
    console.log(aiResponse);

    res.json({
      success: true,
      aiResponse,
    });

  } catch (error) {
    console.log("\n========== GROQ ERROR ==========");

    if (error.status) {
      console.log("Status:", error.status);
    }

    if (error.code) {
      console.log("Code:", error.code);
    }

    console.log(error);

    res.status(500).json({
      success: false,
      error: error.message || "Unknown Error",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});