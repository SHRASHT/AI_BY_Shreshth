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
    <div className="flex flex-col items-center">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6">
        <div className="relative group">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your idea, concept, or challenge..."
            className="cyber-input"
            required
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neon-pink via-neon-blue to-cyber-purple opacity-0 group-hover:opacity-10 transition-opacity rounded-lg pointer-events-none"></div>
        </div>
        <button type="submit" className="cyber-btn" disabled={loading}>
          {loading ? "Processing..." : "Generate Ideas"}
        </button>
      </form>

      {loading && (
        <div className="loading mt-8">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 bg-neon-blue rounded-full animate-ping"></div>
            <p>Neural Network Processing...</p>
          </div>
        </div>
      )}

      {responses.length > 0 && (
        <div className="w-full max-w-2xl mt-12 space-y-8">
          <div className="space-y-4">
            <h3 className="text-neon-blue text-2xl font-bold flex items-center">
              <span className="mr-2">💡</span>
              AI Model Insights
            </h3>
            {responses.map((resp, i) => (
              <div key={i} className="response-card backdrop-blur-sm">
                <div className="flex items-start">
                  <span className="text-neon-pink mr-3 text-xl">#{i + 1}</span>
                  <p className="text-gray-200">{resp}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="final-idea">
            <h3 className="text-neon-yellow text-2xl font-bold mb-4 flex items-center">
              <span className="mr-2">⚡</span>
              Synthesized Insight
            </h3>
            <p className="text-white text-lg leading-relaxed">{finalIdea}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrainstormForm;
