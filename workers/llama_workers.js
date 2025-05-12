const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const PORT = 5005;

app.post("/suggest", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3",
      prompt: prompt,
      stream: false,
    });

    res.json({ suggestion: response.data.response });
  } catch (error) {
    console.error("Ollama error:", error.message || error);
    res.status(500).json({ error: "Failed to get response from local model." });
  }
});

app.listen(PORT, () => {
  console.log(`Local LLaMA Worker running at http://localhost:${PORT}`);
});
