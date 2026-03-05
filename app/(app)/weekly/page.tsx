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

interface WeeklyReading {
  theme: string;
  overview: string;
  love: string;
  career: string;
  wellness: string;
  luckyDay: string;
  luckyNumber: number;
}

export default function WeeklyPage() {
  const { profile, isPremium } = useProfile();
  const [reading, setReading] = useState<WeeklyReading | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReading();
  }, []);

  async function loadReading() {
    try {
      const res = await fetch("/api/weekly");
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

  const sections = reading
    ? [
        { icon: "❤️", label: "Love & Relationships", content: reading.love },
        { icon: "💼", label: "Career & Finances", content: reading.career },
        { icon: "🌿", label: "Health & Wellness", content: reading.wellness },
      ]
    : [];

  return (
    <AppShell>
      <motion.div variants={staggerContainer} initial="initial" animate="animate">
        <SectionHeader
          title="Weekly Reading"
          subtitle={`${profile.sign} · This week's cosmic forecast`}
          icon={ZODIAC_EMOJIS[profile.sign] || "⭐"}
        />

        {reading && (
          <>
            {/* Theme */}
            <motion.div {...fadeUp} className="mb-5">
              <GlassCard className="border-accent/15 text-center">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                  Weekly Theme
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

            {/* Sections */}
            <motion.div {...fadeUp} className="mb-5 space-y-3">
              {sections.map((s) => (
                <GlassCard key={s.label}>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-lg">{s.icon}</span>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-txt-muted">
                      {s.label}
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed text-txt">{s.content}</p>
                </GlassCard>
              ))}
            </motion.div>

            {/* Lucky */}
            <motion.div {...fadeUp}>
              <div className="flex gap-3">
                <GlassCard className="flex-1 text-center">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-txt-muted">
                    Lucky Day
                  </p>
                  <p className="text-lg font-bold text-accent">{reading.luckyDay}</p>
                </GlassCard>
                <GlassCard className="flex-1 text-center">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-txt-muted">
                    Lucky Number
                  </p>
                  <p className="text-lg font-bold text-accent">{reading.luckyNumber}</p>
                </GlassCard>
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </AppShell>
  );
}
