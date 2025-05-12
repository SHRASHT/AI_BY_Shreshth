import React, { useState } from "react";
import axios from "axios";

const BrainstormForm = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState([]);
  const [finalIdea, setFinalIdea] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponses([]);
    setFinalIdea("");

    try {
      const res = await axios.post("http://localhost:5000/suggest", { prompt });
      setResponses(res.data.suggestions);
      setFinalIdea(res.data.final);
    } catch (err) {
      console.error(err);
      alert("Error fetching suggestions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your topic or problem..."
          style={{ width: "60%", padding: "10px" }}
          required
        />
        <button type="submit" style={{ padding: "10px", marginLeft: "10px" }}>
          Get Suggestions
        </button>
      </form>

      {loading && <p>Loading suggestions...</p>}

      {responses.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Responses from Models:</h3>
          <ul>
            {responses.map((resp, i) => (
              <li key={i}>{resp}</li>
            ))}
          </ul>

          <h3>🧠 Final Merged Suggestion:</h3>
          <p>
            <strong>{finalIdea}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default BrainstormForm;
