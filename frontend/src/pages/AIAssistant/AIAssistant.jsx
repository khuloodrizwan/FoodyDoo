import React from 'react';
import './AIAssistant.css';
import AIChat from '../../components/AIChat/AIChat';

const AIAssistant = ({ url, token }) => {
  return (
    <div className="ai-assistant">
      <div className="ai-assistant-header">
        <h1>🤖 AI Food Assistant</h1>
        <p>Get personalized food recommendations powered by AI</p>
      </div>
      <AIChat url={url} token={token} />
    </div>
  );
};

export default AIAssistant;