const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const cors = require("cors");
app.use(bodyParser.json());
app.use(cors());

const PORT = 5003;

app.post("/suggest", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-4-maverick:free",
        messages: [
          { role: "system", content: "You are an expert brainstormer." },
          { role: "user", content: `Give a creative idea for: ${prompt}` },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.LLAMA_API_KEY}`,
          "HTTP-Referer": "http://localhost:3000", // or your actual domain
          "Content-Type": "application/json",
        },
      }
    );

    if (
      response?.data?.choices &&
      Array.isArray(response.data.choices) &&
      response.data.choices[0]?.message?.content
    ) {
      const aiReply = response.data.choices[0].message.content;
      res.json({ suggestion: aiReply });
    } else {
      console.error("Invalid response format from OpenRouter:", response.data);
      res.status(500).json({ error: "Invalid response from OpenRouter" });
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
