"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  GlowButton,
  EmptyState,
  UpgradeBanner,
  SkeletonPage,
  StatPill,
  useToast,
} from "@/components/ui";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [usage, setUsage] = useState({ used: 0, limit: 3 });
  const [needsUpgrade, setNeedsUpgrade] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadMessages() {
    try {
      const res = await fetch("/api/chat");
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const userMessage = input.trim();
    setInput("");
    setError("");
    setSending(true);
    setNeedsUpgrade(false);

    const tempId = "temp-" + Date.now();
    setMessages((prev) => [
      ...prev,
      { id: tempId, role: "user", content: userMessage, createdAt: new Date().toISOString() },
    ]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      if (res.status === 402) {
        setNeedsUpgrade(true);
        setError("You’ve hit today’s message limit");
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        return;
      }

      if (res.status === 429) {
        setError("Slow down — try again in a moment");
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        return;
      }

      if (!res.ok) {
        setError(data.error || "Something went wrong — try again");
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: data.messageId,
          role: "assistant",
          content: data.reply,
          createdAt: new Date().toISOString(),
        },
      ]);

      setUsage({ used: data.messagesUsed, limit: data.messagesLimit });
    } catch {
      setError("Couldn’t send that — check your connection");
      toast("Failed to send message", "error");
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 pt-20 md:pt-8">
        <SkeletonPage />
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-[100dvh] max-w-2xl flex-col pt-14 pb-0 md:pt-0">
        {/* Header */}
        <div className="border-b border-border bg-surface-glass/50 px-4 py-3 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base font-bold text-txt">Astro Coach</h1>
              <p className="text-[11px] text-txt-muted">Your personal astrology guide</p>
            </div>
            <StatPill
              label={`${usage.used}/${usage.limit} today`}
              className={usage.used >= usage.limit ? "!border-amber-500/30 !text-amber-400" : ""}
            />
          </div>
        </div>

        {/* Messages */}
        <div role="log" aria-live="polite" aria-label="Chat messages" className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.length === 0 && (
            <EmptyState
              icon="🌟"
              title="What’s on your mind?"
              description="Ask about your sign, relationships, career, or how your day looks"
            />
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-3xl px-4 py-3 ${
                    msg.role === "user"
                      ? "rounded-br-lg bg-accent-dim text-accent-bright"
                      : "rounded-bl-lg border border-border bg-surface-raised text-txt-secondary"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-accent-bright">
                      Astro Coach
                    </p>
                  )}
                  <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
                  <p className={`mt-1.5 text-[10px] ${
                    msg.role === "user" ? "text-accent/60" : "text-txt-dim"
                  }`}>
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {sending && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
              aria-label="Astro Coach is typing"
            >
              <div className="rounded-3xl rounded-bl-lg border border-border bg-surface-raised px-4 py-3">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-accent-bright">
                  Astro Coach
                </p>
                <div className="flex gap-1.5 py-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="h-2 w-2 rounded-full bg-accent/50"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error / Upgrade */}
        {error && (
          <div className="px-4 pb-2">
            <div role="alert" className="rounded-2xl border border-red-500/20 bg-red-500/8 px-4 py-2.5 text-sm text-red-400">
              {error}
            </div>
          </div>
        )}

        {needsUpgrade && (
          <div className="px-4 pb-2">
            <UpgradeBanner onUpgrade={() => router.push("/settings")} />
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={sendMessage}
          className="border-t border-border bg-surface-glass/50 px-4 py-3 pb-20 backdrop-blur-md md:pb-3"
        >
          <div className="flex items-center gap-2">
            <label htmlFor="chat-input" className="sr-only">Message</label>
            <input
              id="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your chart…"
              className="input flex-1 !rounded-full !py-2.5"
              maxLength={1000}
              disabled={sending}
            />
            <GlowButton
              type="submit"
              size="sm"
              disabled={!input.trim() || sending}
              className="!rounded-full !px-4"
              aria-label="Send message"
            >
              ✦
            </GlowButton>
          </div>
        </form>
      </div>
  );
}
