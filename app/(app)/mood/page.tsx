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

interface MoodEntry {
  id: string;
  date: string;
  mood: string;
  energy: number | null;
  note: string | null;
}

const moodOptions = [
  { value: "rough", emoji: "😢", label: "Rough" },
  { value: "low", emoji: "😕", label: "Low" },
  { value: "okay", emoji: "😐", label: "Okay" },
  { value: "good", emoji: "😊", label: "Good" },
  { value: "amazing", emoji: "🌟", label: "Amazing" },
];

const moodColors: Record<string, string> = {
  rough: "bg-red-500/20",
  low: "bg-orange-500/20",
  okay: "bg-yellow-500/20",
  good: "bg-green-500/20",
  amazing: "bg-purple-500/20",
};

function getMoodEmoji(mood: string) {
  return moodOptions.find((m) => m.value === mood)?.emoji || "😐";
}
function getMoodLabel(mood: string) {
  return moodOptions.find((m) => m.value === mood)?.label || mood;
}

export default function MoodPage() {
  const { profile } = useProfile();
  const { toast } = useToast();
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [mood, setMood] = useState("");
  const [energy, setEnergy] = useState(0);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  async function loadEntries() {
    try {
      const res = await fetch("/api/mood");
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

  async function saveMood() {
    if (!mood) return;
    setSaving(true);
    try {
      const res = await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, energy: energy || undefined, notes: notes || undefined }),
      });
      if (res.ok) {
        const entry = await res.json();
        setEntries((prev) => [entry, ...prev.filter((e) => e.id !== entry.id)]);
        setMood("");
        setEnergy(0);
        setNotes("");
        toast("Mood logged ✨");
      }
    } catch (e) {
      console.error(e);
      toast("Failed to log mood");
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
          title="Mood Tracker"
          subtitle="Track your emotional tides through the cosmos"
          icon="🌊"
        />

        {/* Log Mood */}
        {!todayEntry && (
          <motion.div {...fadeUp} className="mb-5">
            <GlassCard>
              <p className="mb-3 text-sm font-semibold text-txt">How are you feeling today?</p>
              <div className="mb-4 flex justify-between gap-2">
                {moodOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setMood(opt.value)}
                    className={`flex-1 rounded-lg py-3 text-center text-xs transition-all ${
                      mood === opt.value
                        ? `${moodColors[opt.value]} ring-2 ring-accent`
                        : "bg-surface/50 hover:bg-surface"
                    }`}
                  >
                    <span className="block text-2xl">{opt.emoji}</span>
                    <span className="mt-1 block text-txt-muted">{opt.label}</span>
                  </button>
                ))}
              </div>

              <p className="mb-2 text-xs text-txt-muted">Energy level (optional)</p>
              <div className="mb-4 flex gap-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    onClick={() => setEnergy(val)}
                    className={`flex-1 rounded-lg py-2 text-center text-sm transition-all ${
                      energy === val
                        ? "bg-accent/20 ring-2 ring-accent"
                        : "bg-surface/50 hover:bg-surface"
                    }`}
                  >
                    {"⚡".repeat(val)}
                  </button>
                ))}
              </div>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any notes about your day? (optional)"
                className="mb-3 w-full rounded-lg bg-surface/50 p-3 text-sm text-txt placeholder-txt-muted outline-none ring-1 ring-white/5 focus:ring-accent/30"
                rows={2}
              />
              <GlowButton onClick={saveMood} disabled={saving || !mood} full>
                {saving ? "Saving..." : "Log Mood"}
              </GlowButton>
            </GlassCard>
          </motion.div>
        )}

        {/* Today */}
        {todayEntry && (
          <motion.div {...fadeUp} className="mb-5">
            <GlassCard className="border-green-500/20">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-green-400">
                Today&apos;s Mood
              </p>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{getMoodEmoji(todayEntry.mood)}</span>
                <div>
                  <p className="font-semibold text-txt">{getMoodLabel(todayEntry.mood)}</p>
                  {todayEntry.energy && (
                    <p className="text-xs text-txt-muted">Energy: {"⚡".repeat(todayEntry.energy)}</p>
                  )}
                </div>
              </div>
              {todayEntry.note && (
                <p className="mt-2 text-sm text-txt-muted">{todayEntry.note}</p>
              )}
            </GlassCard>
          </motion.div>
        )}

        {/* Mood History Chart */}
        {entries.length > 1 && (
          <motion.div {...fadeUp} className="mb-5">
            <GlassCard>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-txt-muted">
                Last 14 Days
              </p>
              <div className="flex items-end gap-1">
                {entries
                  .slice(0, 14)
                  .reverse()
                  .map((entry) => {
                    const moodIndex = moodOptions.findIndex((m) => m.value === entry.mood) + 1;
                    return (
                      <div key={entry.id} className="flex flex-1 flex-col items-center gap-1">
                        <div
                          className={`w-full rounded-t-sm ${moodColors[entry.mood] || "bg-white/10"} transition-all`}
                          style={{ height: `${moodIndex * 16}px` }}
                        />
                        <span className="text-[8px] text-txt-muted">
                          {new Date(entry.date).getDate()}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Past Entries */}
        {entries.filter((e) => e.date !== today).length > 0 ? (
          <motion.div {...fadeUp}>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-txt-muted">
              History
            </p>
            <div className="space-y-2">
              {entries
                .filter((e) => e.date !== today)
                .slice(0, 14)
                .map((entry) => (
                  <GlassCard key={entry.id} className="flex items-center gap-3 !p-3">
                    <span className="text-xl">{getMoodEmoji(entry.mood)}</span>
                    <div className="flex-1">
                      <p className="text-xs text-txt-muted">
                        {new Date(entry.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      {entry.note && (
                        <p className="mt-0.5 truncate text-xs text-txt">{entry.note}</p>
                      )}
                    </div>
                    {entry.energy && (
                      <span className="text-xs text-txt-muted">{"⚡".repeat(entry.energy)}</span>
                    )}
                  </GlassCard>
                ))}
            </div>
          </motion.div>
        ) : (
          !todayEntry && (
            <EmptyState
              icon="🌊"
              title="No mood data yet"
              description="Start tracking to see patterns in your cosmic energy"
            />
          )
        )}
      </motion.div>
    </AppShell>
  );
}
