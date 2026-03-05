"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useProfile } from "@/components/auth-shell";
import {
  AppShell,
  SectionHeader,
  GlassCard,
  SkeletonPage,
  ZODIAC_EMOJIS,
  fadeUp,
  staggerContainer,
} from "@/components/ui";

interface MonthlyReading {
  theme: string;
  overview: string;
  highlights: string[];
  challenges: string;
  advice: string;
  bestDays: string;
  focusArea: string;
}

export default function MonthlyPage() {
  const { profile, isPremium } = useProfile();
  const [reading, setReading] = useState<MonthlyReading | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReading();
  }, []);

  async function loadReading() {
    try {
      const res = await fetch("/api/monthly");
      if (res.ok) {
        const data = await res.json();
        setReading(data.reading);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading || !profile) {
    return (
      <AppShell>
        <SkeletonPage />
      </AppShell>
    );
  }

  const monthName = new Date().toLocaleString("default", { month: "long" });

  return (
    <AppShell>
      <motion.div variants={staggerContainer} initial="initial" animate="animate">
        <SectionHeader
          title={`${monthName} Forecast`}
          subtitle={`${profile.sign} · Monthly cosmic outlook`}
          icon={ZODIAC_EMOJIS[profile.sign] || "⭐"}
        />

        {reading && (
          <>
            {/* Theme */}
            <motion.div {...fadeUp} className="mb-5">
              <GlassCard className="border-accent/15 text-center">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                  {monthName} Theme
                </p>
                <h2 className="text-lg font-bold text-txt">{reading.theme}</h2>
              </GlassCard>
            </motion.div>

            {/* Overview */}
            <motion.div {...fadeUp} className="mb-5">
              <GlassCard>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-txt-muted">
                  Overview
                </p>
                <p className="text-sm leading-relaxed text-txt">{reading.overview}</p>
              </GlassCard>
            </motion.div>

            {/* Highlights */}
            <motion.div {...fadeUp} className="mb-5">
              <GlassCard>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-txt-muted">
                  ✨ Key Highlights
                </p>
                <ul className="space-y-2">
                  {reading.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-txt">
                      <span className="text-accent">•</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </motion.div>

            {/* Challenges */}
            <motion.div {...fadeUp} className="mb-5">
              <GlassCard className="border-orange-500/10">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400">
                  ⚡ Challenges to Navigate
                </p>
                <p className="text-sm leading-relaxed text-txt">{reading.challenges}</p>
              </GlassCard>
            </motion.div>

            {/* Advice */}
            <motion.div {...fadeUp} className="mb-5">
              <GlassCard className="border-green-500/10">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-green-400">
                  🌟 Cosmic Advice
                </p>
                <p className="text-sm leading-relaxed text-txt">{reading.advice}</p>
              </GlassCard>
            </motion.div>

            {/* Meta */}
            <motion.div {...fadeUp}>
              <div className="flex gap-3">
                <GlassCard className="flex-1 text-center">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-txt-muted">
                    Best Days
                  </p>
                  <p className="text-sm font-semibold text-accent">{reading.bestDays}</p>
                </GlassCard>
                <GlassCard className="flex-1 text-center">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-txt-muted">
                    Focus Area
                  </p>
                  <p className="text-sm font-semibold text-accent">{reading.focusArea}</p>
                </GlassCard>
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </AppShell>
  );
}
