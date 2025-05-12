const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

const PORT = 5002; // unique port per worker

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
          "HTTP-Referer": "http://localhost:3000", // or your domain
          "Content-Type": "application/json",
        },
      }
    );

    const aiReply = response.data.choices[0].message.content;
    res.json({ suggestion: aiReply });
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
