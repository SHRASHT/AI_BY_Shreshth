const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
const cors = require("cors");
app.use(cors());

const PORT = 5001; // unique port per worker

app.post("/suggest", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "microsoft/mai-ds-r1:free",
        messages: [
          { role: "system", content: "You are an expert brainstormer." },
          { role: "user", content: `Give a creative idea for: ${prompt}` },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.MICROSOFT_API_KEY}`,
          "HTTP-Referer": "http://localhost:3000",
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
