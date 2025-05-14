import React from "react";
import BrainstormForm from "./components/BrainstormForm";
import "./index.css";

function App() {
  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-dark-bg via-black to-dark-bg">
      <div className="relative cyber-container">
        <div className="absolute -top-1 -left-1 -right-1 -bottom-1 bg-gradient-to-r from-neon-pink via-neon-blue to-cyber-purple opacity-10 blur-xl rounded-2xl"></div>
        <h1 className="cyber-title">Neural Nexus</h1>
        <p className="text-center mb-12 text-gray-400 text-lg">
          Unleash the power of multi-model AI brainstorming
        </p>
        <BrainstormForm />
      </div>
    </div>
  );
}

export default App;
