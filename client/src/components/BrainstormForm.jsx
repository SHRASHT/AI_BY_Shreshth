import React, { useState } from "react";
import axios from "axios";

const BrainstormForm = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [formattedResponse, setFormattedResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormattedResponse("");

    try {
      const res = await axios.post("http://localhost:5000/suggest", { prompt });
      setFormattedResponse(res.data.final);
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

      {formattedResponse && (
        <div className="w-full max-w-2xl mt-12">
          <pre className="whitespace-pre-wrap font-mono text-sm bg-opacity-20 bg-black p-6 rounded-lg border-2 border-neon-blue text-gray-200">
            {formattedResponse}
          </pre>
        </div>
      )}
    </div>
  );
};

export default BrainstormForm;
