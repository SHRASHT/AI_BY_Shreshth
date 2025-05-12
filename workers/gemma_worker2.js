const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 5007; // You can choose any free port

app.post("/suggest", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "gemma:2b",
      prompt: `Give an example and a real-life scenario ${prompt}`,
      stream: false,
    });

    res.json({ suggestion: response.data.response.trim() });
  } catch (error) {
    console.error("Ollama error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to get response from local model" });
  }
});

app.listen(PORT, () => {
  console.log(`Gemma Worker running on http://localhost:${PORT}`);
});
