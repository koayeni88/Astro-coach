"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useProfile } from "@/components/auth-shell";
import {
  AppShell,
  SectionHeader,
  GlassCard,
  GlowButton,
  SkeletonPage,
  EmptyState,
  fadeUp,
  staggerContainer,
  useToast,
} from "@/components/ui";

interface JournalEntry {
  id: string;
  date: string;
  content: string;
  prompt: string | null;
  mood: string | null;
  sign: string | null;
  createdAt: string;
}

const moods = ["😊", "😌", "😔", "😤", "🥰", "😰", "✨", "🌙"];

export default function JournalPage() {
  const { profile } = useProfile();
  const { toast } = useToast();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [saving, setSaving] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadEntries();
    loadPrompt();
  }, []);

  async function loadEntries() {
    try {
      const res = await fetch("/api/journal");
      if (res.ok) {
        const data = await res.json();
        setEntries(data.entries);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function loadPrompt() {
    try {
      const res = await fetch("/api/journal/prompt");
      if (res.ok) {
        const data = await res.json();
        setPrompt(data.prompt || "What are you grateful for today?");
      }
    } catch {
      setPrompt("What are you grateful for today?");
    }
  }

  async function saveEntry() {
    if (!content.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, mood: selectedMood, prompt }),
      });
      if (res.ok) {
        const entry = await res.json();
        setEntries((prev) => [entry, ...prev.filter((e) => e.id !== entry.id)]);
        setContent("");
        setSelectedMood("");
        setShowForm(false);
        toast("Journal entry saved ✨");
      }
    } catch (e) {
      console.error(e);
      toast("Failed to save entry");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AppShell>
        <SkeletonPage />
      </AppShell>
    );
  }

  const today = new Date().toISOString().split("T")[0];
  const todayEntry = entries.find((e) => e.date === today);

  return (
    <AppShell>
      <motion.div variants={staggerContainer} initial="initial" animate="animate">
        <SectionHeader
          title="Cosmic Journal"
          subtitle="Reflect on your journey through the stars"
          icon="📓"
        />

        {/* Reflection Prompt */}
        <motion.div {...fadeUp} className="mb-5">
          <GlassCard className="border-accent/15">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
              Today&apos;s Reflection
            </p>
            <p className="text-sm text-txt">{prompt}</p>
          </GlassCard>
        </motion.div>

        {/* Write Entry Toggle */}
        {!todayEntry && !showForm && (
          <motion.div {...fadeUp} className="mb-5">
            <GlowButton onClick={() => setShowForm(true)} full>
              ✍️ Write Today&apos;s Entry
            </GlowButton>
          </motion.div>
        )}

        {/* Entry Form */}
        {showForm && (
          <motion.div {...fadeUp} className="mb-5">
            <GlassCard>
              <div className="mb-3 flex flex-wrap gap-2">
                <p className="w-full text-xs text-txt-muted">How are you feeling?</p>
                {moods.map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedMood(m)}
                    className={`rounded-full px-3 py-1.5 text-lg transition-all ${
                      selectedMood === m
                        ? "bg-accent/20 ring-2 ring-accent"
                        : "bg-surface/50 hover:bg-surface"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your thoughts..."
                className="mb-3 w-full rounded-lg bg-surface/50 p-3 text-sm text-txt placeholder-txt-muted outline-none ring-1 ring-white/5 focus:ring-accent/30"
                rows={6}
              />
              <div className="flex gap-2">
                <GlowButton onClick={saveEntry} disabled={saving || !content.trim()}>
                  {saving ? "Saving..." : "Save Entry"}
                </GlowButton>
                <button
                  onClick={() => setShowForm(false)}
                  className="rounded-lg px-4 py-2 text-sm text-txt-muted hover:text-txt"
                >
                  Cancel
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Today's Entry */}
        {todayEntry && !showForm && (
          <motion.div {...fadeUp} className="mb-5">
            <GlassCard className="border-green-500/20">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-400">
                  Today&apos;s Entry
                </p>
                {todayEntry.mood && <span className="text-xl">{todayEntry.mood}</span>}
              </div>
              <p className="text-sm leading-relaxed text-txt">{todayEntry.content}</p>
            </GlassCard>
          </motion.div>
        )}

        {/* Past Entries */}
        {entries.filter((e) => e.date !== today).length > 0 ? (
          <motion.div {...fadeUp}>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-txt-muted">
              Past Entries
            </p>
            <div className="space-y-3">
              {entries
                .filter((e) => e.date !== today)
                .map((entry) => (
                  <GlassCard key={entry.id}>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs text-txt-muted">
                        {new Date(entry.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      {entry.mood && <span>{entry.mood}</span>}
                    </div>
                    <p className="text-sm leading-relaxed text-txt line-clamp-3">
                      {entry.content}
                    </p>
                  </GlassCard>
                ))}
            </div>
          </motion.div>
        ) : (
          !todayEntry && (
            <EmptyState
              icon="📓"
              title="No entries yet"
              description="Start journaling to track your cosmic journey"
            />
          )
        )}
      </motion.div>
    </AppShell>
  );
}
