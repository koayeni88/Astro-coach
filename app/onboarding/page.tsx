"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import {
  AppShell,
  SectionHeader,
  GlassCard,
  GlowButton,
  FullPageLoader,
  fadeUp,
  staggerContainer,
} from "@/components/ui";

const FOCUS_AREAS = [
  { value: "love", label: "❤️ Love & Relationships" },
  { value: "career", label: "💼 Career & Purpose" },
  { value: "money", label: "💰 Money & Abundance" },
  { value: "peace", label: "☮️ Peace & Wellbeing" },
];

const MOODS = [
  { value: "happy", label: "😊 Happy" },
  { value: "anxious", label: "😰 Anxious" },
  { value: "motivated", label: "💪 Motivated" },
  { value: "reflective", label: "🤔 Reflective" },
  { value: "confused", label: "😵 Confused" },
  { value: "neutral", label: "😐 Neutral" },
  { value: "sad", label: "😢 Sad" },
  { value: "excited", label: "🤩 Excited" },
  { value: "intense", label: "🔥 Intense" },
  { value: "peaceful", label: "🧘 Peaceful" },
];

const STRUGGLES = [
  { value: "none", label: "None right now" },
  { value: "patience", label: "Patience" },
  { value: "trust", label: "Trust" },
  { value: "vulnerability", label: "Vulnerability" },
  { value: "direction", label: "Direction / Purpose" },
  { value: "confidence", label: "Confidence" },
  { value: "boundaries", label: "Boundaries" },
  { value: "letting-go", label: "Letting Go" },
  { value: "communication", label: "Communication" },
  { value: "balance", label: "Work-Life Balance" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [birthDate, setBirthDate] = useState("");
  const [focusArea, setFocusArea] = useState("peace");
  const [mood, setMood] = useState("neutral");
  const [struggle, setStruggle] = useState("none");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (status === "loading") return <FullPageLoader />;

  if (!session) {
    router.push("/login");
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ birthDate, focusArea, mood, struggle }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(
          typeof data.error === "string"
            ? data.error
            : "Something doesn't look right—check your inputs"
        );
        return;
      }

      await fetch("/api/daily/generate", { method: "POST" });
      router.push("/dashboard");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Minimal header for onboarding */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-surface-glass/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
          <span className="text-base font-bold tracking-tight text-txt">
            <span className="text-accent-bright">✦</span> Astro Coach
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-xs font-medium text-txt-muted transition-colors hover:text-txt-secondary"
          >
            Sign out
          </button>
        </div>
      </header>

      <AppShell>
        <SectionHeader
          title={`Hey ${session?.user?.name || 'there'}, let\'s get started`}
          subtitle="A few quick questions so we can personalize everything for you"
          icon="🌟"
        />

        <motion.form
          onSubmit={handleSubmit}
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-5"
        >
          {error && (
            <motion.div {...fadeUp} role="alert" className="rounded-2xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-400">
              {error}
            </motion.div>
          )}

          <motion.div {...fadeUp}>
            <GlassCard>
              <label htmlFor="birthDate" className="label">
                Your birthday
              </label>
              <input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="input"
                max={new Date().toISOString().split("T")[0]}
                required
              />
              <p className="mt-2 text-xs text-txt-dim">
                This determines your zodiac sign—we don&apos;t share it
              </p>
            </GlassCard>
          </motion.div>

          <motion.div {...fadeUp}>
            <GlassCard>
              <label htmlFor="focusArea" className="label">
                What matters most to you right now?
              </label>
              <select
                id="focusArea"
                value={focusArea}
                onChange={(e) => setFocusArea(e.target.value)}
                className="input"
              >
                {FOCUS_AREAS.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </GlassCard>
          </motion.div>

          <motion.div {...fadeUp}>
            <GlassCard>
              <label htmlFor="mood" className="label">
                How are you feeling lately?
              </label>
              <select
                id="mood"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="input"
              >
                {MOODS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </GlassCard>
          </motion.div>

          <motion.div {...fadeUp}>
            <GlassCard>
              <label htmlFor="struggle" className="label">
                Anything you&apos;re working through?
              </label>
              <select
                id="struggle"
                value={struggle}
                onChange={(e) => setStruggle(e.target.value)}
                className="input"
              >
                {STRUGGLES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </GlassCard>
          </motion.div>

          <motion.div {...fadeUp}>
            <GlowButton type="submit" className="w-full" size="lg" loading={loading}>
              Build My Profile
            </GlowButton>
          </motion.div>
        </motion.form>
      </AppShell>
    </>
  );
}
