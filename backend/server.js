const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();

app.use(cors());

app.use(
  express.json({
    limit: "50mb",
  })
);

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// ----------------------------------------------------
// Health Check
// ----------------------------------------------------

app.get("/", (req, res) => {
  res.send("🚀 GrowEasy Backend is Running");
});

// ----------------------------------------------------
// AI Test Route
// ----------------------------------------------------

app.get("/test-ai", async (req, res) => {
  try {

    const completion =
      await client.chat.completions.create({

        model: "llama-3.3-70b-versatile",

        messages: [
          {
            role: "user",
            content:
              "Reply only with: Groq connection successful",
          },
        ],

      });

    res.json({
      success: true,
      message:
        completion.choices[0].message.content,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
});

// ----------------------------------------------------
// Split CSV into batches
// ----------------------------------------------------

function splitIntoBatches(data, batchSize = 20) {

  const batches = [];

  for (let i = 0; i < data.length; i += batchSize) {

    batches.push(
      data.slice(i, i + batchSize)
    );

  }

  return batches;

}

// ----------------------------------------------------
// Clean AI JSON
// ----------------------------------------------------

function cleanJSON(text) {

  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

}

// ----------------------------------------------------
// Analyze One Batch
// ----------------------------------------------------

async function analyzeBatch(batch) {

  const prompt = `

You are an AI CRM Lead Scoring Assistant.

Analyze every lead.

For EACH lead return:

Name
Company
Lead Score (0-100)
Category (Hot/Warm/Cold)
Reason

IMPORTANT:

Return ONLY a valid JSON array.

Example:

[
 {
   "Name":"Rahul",
   "Company":"ABC",
   "Lead Score":90,
   "Category":"Hot",
   "Reason":"Large software company."
 }
]

Leads:

${JSON.stringify(batch)}

`;

  const completion =
    await client.chat.completions.create({

      model: "llama-3.3-70b-versatile",

      temperature: 0.2,

      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],

    });

  const response =
    completion.choices[0].message.content;

  const cleaned =
    cleanJSON(response);

  return JSON.parse(cleaned);

}
// ----------------------------------------------------
// CSV Import Route
// ----------------------------------------------------

app.post("/import", async (req, res) => {

  try {

    const { data } = req.body;

    if (!data || !Array.isArray(data) || data.length === 0) {

      return res.status(400).json({
        success: false,
        error: "CSV data is empty.",
      });

    }

    console.log("\n==================================");
    console.log("CSV RECEIVED");
    console.log("Total Leads:", data.length);
    console.log("==================================\n");

    const batches = splitIntoBatches(data, 20);

    console.log("Total Batches:", batches.length);

    const finalResult = [];

    for (let i = 0; i < batches.length; i++) {

      console.log(`\nProcessing Batch ${i + 1} of ${batches.length}`);

      let retries = 3;
      let success = false;

      while (!success && retries > 0) {

        try {

          const result = await analyzeBatch(batches[i]);

          finalResult.push(...result);

          success = true;

          console.log(
            `Batch ${i + 1} Completed`
          );

        } catch (err) {

          retries--;

          console.log(
            `Retrying Batch ${i + 1}... Remaining: ${retries}`
          );

          if (retries === 0) {

            console.log(err);

            return res.status(500).json({
              success: false,
              error:
                "AI failed while analyzing CSV. Please try again.",
            });

          }

        }

      }

    }

    console.log("\n==================================");
    console.log("ALL BATCHES COMPLETED");
    console.log("==================================\n");

    res.json({

      success: true,

      aiResponse: JSON.stringify(
        finalResult,
        null,
        2
      ),

    });

  } catch (err) {

    console.log("\n==================================");
    console.log("SERVER ERROR");
    console.log("==================================");

    console.log(err);

    res.status(500).json({

      success: false,

      error:
        err.message || "Unknown Server Error",

    });

  }

});

// ----------------------------------------------------
// Start Server
// ----------------------------------------------------

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `🚀 Server running on http://localhost:${PORT}`
  );

});