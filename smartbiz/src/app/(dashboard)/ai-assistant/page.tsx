"use client";

import { useState, useRef, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, User, Loader2, Sparkles, TrendingUp } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi Rajesh! I'm your SmartBiz AI assistant. Ask me anything about your finances, overdue invoices, or cash flow. For example:\n\n- 'Who owes me the most money?'\n- 'What were my total expenses last month?'\n- 'Show me overdue invoices'",
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput("");
    
    setMessages(prev => [...prev, { id: Date.now().toString(), role: "user", content: userMsg }]);
    setIsLoading(true);
    
    // Simulate AI thinking and streaming response (Phase 4 integrates real AI route)
    setTimeout(() => {
      setIsLoading(false);
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: "assistant", 
        content: `Based on your records, Tech Solutions India Pvt Ltd owes you the most at **₹1,71,100** (Invoice INV-0027).\n\nYour total outstanding AR is currently **₹4,70,900**. Would you like me to draft an email reminder to Tech Solutions?` 
      }]);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestionPills = [
    "Who owes me the most?",
    "Total expenses this month?",
    "Forecast cash flow",
  ];

  return (
    <div className="h-[calc(100vh-6rem)] lg:h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <PageHeader
        title="AI Business Assistant"
        description="Chat with your business data in plain English."
      />

      <Card className="flex-1 flex flex-col overflow-hidden border-border/60 shadow-lg">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-4 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
            >
              <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-blue-600 text-white shadow-md"
              }`}>
                {msg.role === "user" ? <User className="size-4" /> : <Bot className="size-4" />}
              </div>
              <div className={`rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                msg.role === "user" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted border border-border/50 text-foreground"
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 max-w-[85%] mr-auto">
              <div className="shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                <Bot className="size-4" />
              </div>
              <div className="rounded-2xl px-4 py-3 bg-muted border border-border/50 flex items-center gap-2">
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Searching your database...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        <div className="px-4 py-3 bg-muted/30 border-t border-border flex gap-2 overflow-x-auto hide-scrollbar">
          {suggestionPills.map((pill) => (
            <button
              key={pill}
              onClick={() => setInput(pill)}
              className="whitespace-nowrap px-3 py-1.5 rounded-full bg-background border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="size-3 text-blue-500" />
              {pill}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-background border-t border-border">
          <div className="relative flex items-center">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your business..."
              className="pr-12 py-6 rounded-xl shadow-sm border-muted-foreground/30 focus-visible:ring-primary/20 text-base"
              disabled={isLoading}
            />
            <Button
              size="icon"
              className="absolute right-2 h-9 w-9 rounded-lg"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
            >
              <Send className="size-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
          <div className="mt-2 text-center">
            <p className="text-[10px] text-muted-foreground">
              AI can make mistakes. Always verify critical financial numbers.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
