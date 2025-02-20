import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, Loader } from 'lucide-react';
import axios from 'axios';

interface ResearchAssistantProps {
  context?: string;
  placeholder?: string;
  onResponse?: (response: string) => void;
}

export function ResearchAssistant({ 
  context = "You are a helpful research assistant.",
  placeholder = "Ask me anything about your research...",
  onResponse 
}: ResearchAssistantProps) {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-1B-Instruct";
  const API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const { data } = await axios.post(
        API_URL,
        { 
          inputs: `${context}\n\nUser: ${prompt}\n\nAssistant:` 
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const aiResponse = data[0]?.generated_text || "I apologize, but I couldn't generate a response at this time.";
      setResponse(aiResponse);
      onResponse?.(aiResponse);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setResponse("I apologize, but I'm having trouble connecting right now. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm overflow-hidden"
    >
      <div className="p-4 border-b bg-indigo-50 flex items-center space-x-3">
        <Bot className="w-6 h-6 text-indigo-600" />
        <h3 className="text-lg font-semibold text-gray-900">Research Assistant</h3>
      </div>

      <div className="p-4 space-y-4">
        {response && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-gray-50 rounded-lg"
          >
            <p className="text-gray-700 whitespace-pre-wrap">{response}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="flex space-x-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Send</span>
              </>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
}