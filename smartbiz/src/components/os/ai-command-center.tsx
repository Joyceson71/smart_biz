"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Send, Sparkles, AudioWaveform } from "lucide-react";

export default function AICore() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "JARVIS initialized. All systems nominal. How can I assist with your business today?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: `I've analyzed the request regarding "${userMessage}". Based on current cash flow projections and inventory levels, everything looks stable. Would you like me to generate a detailed report?` 
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-[#040406]">
      {/* 3D Hologram Area (Placeholder for actual R3F scene) */}
      <div className="relative h-48 border-b border-white/10 flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#00E5FF]/5 to-transparent">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:20px_20px]" />
        
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="relative z-10 w-24 h-24 rounded-full border border-[#00E5FF]/30 flex items-center justify-center ai-glow"
        >
          <Bot size={40} className="text-[#00E5FF]" />
        </motion.div>
        
        {/* Mock Audio Waveform */}
        <div className="absolute bottom-4 flex gap-1 items-end h-8">
           {[...Array(15)].map((_, i) => (
             <motion.div 
                key={i}
                animate={{ height: isTyping ? [10, Math.random() * 30 + 10, 10] : 4 }}
                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                className="w-1 bg-[#B026FF] rounded-t-sm opacity-50"
             />
           ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i} 
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.role === "user" 
                ? "bg-white/10 text-white" 
                : "bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-white/90"
            }`}>
              {msg.role === "assistant" && (
                <div className="flex items-center gap-2 mb-2 text-[#00E5FF]">
                  <Sparkles size={14} />
                  <span className="text-xs font-bold tracking-wider">JARVIS</span>
                </div>
              )}
              <p className="leading-relaxed text-sm">{msg.content}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask JARVIS anything about your business..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-4 pr-12 text-white focus:outline-none focus:border-[#00E5FF]/50 transition-colors placeholder:text-white/30"
          />
          <button 
            type="submit"
            disabled={!input.trim()}
            className="absolute right-2 p-2 bg-[#00E5FF]/20 text-[#00E5FF] hover:bg-[#00E5FF]/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </form>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {["Analyze last month's cash flow", "Who are my top suppliers?", "Generate a sales report"].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setInput(suggestion)}
              className="whitespace-nowrap px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
