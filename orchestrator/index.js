const express = require("express");
const axios = require("axios");
const { mergeSuggestions } = require("../utils/merge");

const app = express();
app.use(express.json());

app.post("/suggest", async (req, res) => {
  const { prompt } = req.body;

  try {
    // Step 1: Send prompt to all workers
    const [gpt, mock1, mock2] = await Promise.all([
      axios.post("http://localhost:5001/gpt", { prompt }),
      axios.post("http://localhost:5002/mock1", { prompt }),
      axios.post("http://localhost:5003/mock2", { prompt }),
    ]);

    // Step 2: Merge responses
    const merged = mergeSuggestions([gpt.data, mock1.data, mock2.data]);

    res.json({
      suggestions: [gpt.data, mock1.data, mock2.data],
      final: merged,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to get suggestions" });
  }
});

app.listen(5000, () => console.log("Orchestrator running on port 5000"));
