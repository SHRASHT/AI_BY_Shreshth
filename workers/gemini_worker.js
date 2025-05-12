const express = require("express");
const axios = require("axios");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 5002;

app.post("/suggest", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "google/gemini-2.0-flash-exp:free",
        messages: [
          { role: "system", content: "You are an expert brainstormer." },
          { role: "user", content: `Give a creative idea for: ${prompt}` },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Defensive check
    const choices = response?.data?.choices;
    if (
      Array.isArray(choices) &&
      choices.length > 0 &&
      choices[0]?.message?.content
    ) {
      const aiReply = choices[0].message.content;
      res.json({ suggestion: aiReply });
    } else {
      console.error("Invalid response format:", response.data);
      res
        .status(500)
        .json({ error: "Invalid response format from OpenRouter" });
    }
  } catch (error) {
    console.error("OpenRouter error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to get response from OpenRouter" });
  }
});
app.listen(PORT, () => {
  console.log(
    `GPT Worker (via OpenRouter) running on http://localhost:${PORT}`
  );
});
