const express = require("express");
const axios = require("axios");
const { mergeSuggestions } = require("../utils/merge");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.post("/suggest", async (req, res) => {
  const { prompt } = req.body;

  try {
    const endpoints = [
      { name: "GPT", url: "http://localhost:5007/suggest" },
      { name: "Gemini", url: "http://localhost:5002/suggest" },
      // { name: "LLaMA", url: "http://localhost:5003/suggest" },
    ];

    const results = await Promise.allSettled(
      endpoints.map((ep) =>
        axios.post(ep.url, { prompt }).then((res) => ({
          name: ep.name,
          suggestion: res.data?.suggestion || `No suggestion from ${ep.name}`,
        }))
      )
    );

    const suggestions = results.map((result, index) =>
      result.status === "fulfilled"
        ? result.value.suggestion
        : `Error from ${endpoints[index].name}`
    );

    const merged = mergeSuggestions(suggestions);

    res.json({
      suggestions,
      final: merged,
    });
  } catch (error) {
    console.error(
      "Orchestrator fatal error:",
      error?.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to get suggestions" });
  }
});

app.listen(5000, () => console.log("Orchestrator running on port 5000"));
