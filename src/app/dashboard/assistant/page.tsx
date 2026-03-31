"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, Send, Info, User, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import TypingIndicator from "@/components/TypingIndicator";
import { buildSecurityContext, buildSystemPrompt } from "@/lib/aiContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestedPrompts = [
  "What should I fix first?",
  "Is my Gmail safe?",
  "Explain credential stuffing",
  "Give me a full security action plan",
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text?: string) => {
    const content = text || input.trim();
    if (!content || loading) return;

    const userMsg: Message = { role: "user", content };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const context = buildSecurityContext();
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          context,
        }),
      });

      if (!res.ok || !res.body) {
        const fallback = getFallbackResponse(content);
        setMessages([...newMessages, { role: "assistant", content: fallback }]);
        setLoading(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      setMessages([...newMessages, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantContent += decoder.decode(value);
        setMessages([...newMessages, { role: "assistant", content: assistantContent }]);
      }
    } catch {
      const fallback = getFallbackResponse(content);
      setMessages([...newMessages, { role: "assistant", content: fallback }]);
    }
    setLoading(false);
  };

  const getFallbackResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes("fix first") || q.includes("priority") || q.includes("action plan")) {
      return "Based on your security profile, here's your priority action plan:\n\n🔴 **CRITICAL — Do now:**\n1. Change all passwords found in the RockYou2021 breach immediately. Your plaintext password was exposed.\n2. Enable 2FA on your email accounts — these are the gateway to all other accounts.\n\n🟠 **HIGH — Do this week:**\n3. Update your LinkedIn password and review connected apps.\n4. Change your Adobe credentials and check for unauthorized access.\n\n🟡 **MEDIUM — Do this month:**\n5. Review your Canva account security settings.\n6. Set up a password manager to prevent credential reuse.\n\nYour risk score of 72/100 will drop significantly after completing the critical items.";
    }
    if (q.includes("gmail") || q.includes("email") || q.includes("safe")) {
      return "Looking at your breach data, your email has been found in 5 known breaches (LinkedIn, Canva, Adobe, RockYou2021, Twitter). This means:\n\n⚠️ Your email is widely circulated in breach databases\n⚠️ If you've reused passwords, attackers could access your Gmail\n\n**Immediate steps:**\n1. Change your Gmail password to something unique (16+ chars)\n2. Enable Google 2-Step Verification\n3. Check Google's Security Checkup at myaccount.google.com\n4. Review third-party app access\n\nYour Gmail itself wasn't directly breached, but credential stuffing using leaked passwords is the #1 risk.";
    }
    if (q.includes("credential stuffing")) {
      return "**Credential stuffing** is an automated attack where hackers take leaked email/password combos from one breach and try them on other services.\n\n**Why it matters for you:** Your data appeared in RockYou2021 with a plaintext password. If you've reused that password anywhere, attackers can automatically try it on hundreds of services — Gmail, banking, social media.\n\n**How to protect yourself:**\n1. Use a unique password for every service\n2. Use a password manager (Bitwarden, 1Password)\n3. Enable 2FA everywhere possible\n4. Check haveibeenpwned.com regularly\n\nWith 5 breaches in your profile, you're a high-value target for credential stuffing attacks.";
    }
    return "Based on your current security profile (risk score: 72/100, 5 breaches detected, 2 active dark web mentions), I recommend focusing on:\n\n1. **Password security** — Change compromised passwords immediately, especially from the RockYou2021 breach where plaintext credentials were exposed\n2. **Enable 2FA** on all critical accounts\n3. **Monitor** your accounts for suspicious activity\n\nWould you like me to create a detailed action plan for any specific concern?";
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-shrink-0 mb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Bot className="w-6 h-6 text-[#00d4aa]" /> Joi Security Assistant
        </h1>
        <div className="flex items-start gap-2 mt-3 p-3 rounded-lg bg-[#ffa502]/5 border border-[#ffa502]/10">
          <Info className="w-4 h-4 text-[#ffa502] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[#ffa502]/80">AI responses are based on your scan data and are for guidance only.</p>
        </div>
      </motion.div>

      {/* Suggested Prompts */}
      {messages.length === 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-shrink-0 mb-4">
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                className="px-3 py-2 bg-[#1a1d27] border border-white/[0.07] rounded-lg text-sm text-[#8b8fa8] hover:text-[#00d4aa] hover:border-[#00d4aa]/20 transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" /> {prompt}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#00d4aa]/10 flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8 text-[#00d4aa]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">How can I help secure your accounts?</h3>
              <p className="text-sm text-[#8b8fa8] max-w-sm">
                I have full context of your breaches, risk score, and monitored identities.
                Ask me anything about your security.
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`flex gap-2 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                msg.role === "user" ? "bg-[#00d4aa]/20" : "bg-[#1a1d27] border border-white/[0.07]"
              }`}>
                {msg.role === "user" ? <User className="w-3.5 h-3.5 text-[#00d4aa]" /> : <Bot className="w-3.5 h-3.5 text-[#00d4aa]" />}
              </div>
              <div className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#00d4aa] text-black"
                  : "bg-[#1a1d27] border border-white/[0.07] text-[#e8e8e8] prose prose-invert prose-p:leading-relaxed prose-pre:bg-black/50 prose-a:text-[#00d4aa] max-w-none"
              }`}>
                {msg.role === "user" ? (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                ) : (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {loading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start">
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#1a1d27] border border-white/[0.07] flex items-center justify-center flex-shrink-0">
                <Bot className="w-3.5 h-3.5 text-[#00d4aa]" />
              </div>
              <div className="bg-[#1a1d27] border border-white/[0.07] rounded-xl px-4 py-2">
                <TypingIndicator />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t border-white/[0.07] pt-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
            placeholder="Ask about your security..."
            className="flex-1 px-4 py-3 bg-[#1a1d27] border border-white/[0.07] rounded-xl text-sm text-white placeholder-[#8b8fa8] focus:outline-none focus:border-[#00d4aa]/50 transition-colors"
            disabled={loading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="px-4 py-3 bg-[#00d4aa] rounded-xl hover:bg-[#00d4aa]/90 transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4 text-black" />
          </button>
        </div>
      </div>
    </div>
  );
}
