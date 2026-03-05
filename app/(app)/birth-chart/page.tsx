"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useProfile } from "@/components/auth-shell";
import {
  AppShell,
  SectionHeader,
  GlassCard,
  SkeletonPage,
  StatPill,
  ZODIAC_EMOJIS,
  fadeUp,
  staggerContainer,
} from "@/components/ui";

interface BirthChart {
  sunSign: string;
  moonSign: string | null;
  risingSign: string | null;
  elements: { fire: number; earth: number; air: number; water: number };
  modality: { cardinal: number; fixed: number; mutable: number };
}

export default function BirthChartPage() {
  const { profile } = useProfile();
  const [chart, setChart] = useState<BirthChart | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChart();
  }, []);

  async function loadChart() {
    try {
      const res = await fetch("/api/birth-chart");
      if (res.ok) {
        const data = await res.json();
        setChart(data.chart);
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

  const elementColors: Record<string, string> = {
    fire: "text-red-400",
    earth: "text-green-400",
    air: "text-blue-400",
    water: "text-purple-400",
  };

  return (
    <AppShell>
      <motion.div variants={staggerContainer} initial="initial" animate="animate">
        <SectionHeader
          title="Birth Chart"
          subtitle="Your unique cosmic blueprint"
          icon="🌌"
        />

        {chart && (
          <>
            {/* Big Three */}
            <motion.div {...fadeUp} className="mb-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-txt-muted">
                Your Big Three
              </p>
              <div className="grid grid-cols-3 gap-3">
                <GlassCard className="text-center border-yellow-500/15">
                  <span className="text-3xl">{ZODIAC_EMOJIS[chart.sunSign] || "☀️"}</span>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-400">
                    Sun
                  </p>
                  <p className="text-sm font-bold text-txt">{chart.sunSign}</p>
                  <p className="mt-1 text-[10px] text-txt-muted">Your core identity</p>
                </GlassCard>
                <GlassCard className="text-center border-blue-500/15">
                  <span className="text-3xl">{chart.moonSign ? ZODIAC_EMOJIS[chart.moonSign] || "🌙" : "🌙"}</span>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">
                    Moon
                  </p>
                  <p className="text-sm font-bold text-txt">{chart.moonSign || "Add birth time"}</p>
                  <p className="mt-1 text-[10px] text-txt-muted">Your emotions</p>
                </GlassCard>
                <GlassCard className="text-center border-purple-500/15">
                  <span className="text-3xl">{chart.risingSign ? ZODIAC_EMOJIS[chart.risingSign] || "⬆️" : "⬆️"}</span>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-purple-400">
                    Rising
                  </p>
                  <p className="text-sm font-bold text-txt">{chart.risingSign || "Add birth time"}</p>
                  <p className="mt-1 text-[10px] text-txt-muted">Your outer self</p>
                </GlassCard>
              </div>
            </motion.div>

            {/* Elemental Balance */}
            <motion.div {...fadeUp} className="mb-5">
              <GlassCard>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-txt-muted">
                  🔥 Elemental Balance
                </p>
                <div className="space-y-3">
                  {Object.entries(chart.elements).map(([element, value]) => (
                    <div key={element} className="flex items-center gap-3">
                      <span className={`w-12 text-xs font-semibold capitalize ${elementColors[element]}`}>
                        {element === "fire" ? "🔥" : element === "earth" ? "🌍" : element === "air" ? "💨" : "🌊"}{" "}
                        {element}
                      </span>
                      <div className="flex-1">
                        <div className="h-2.5 overflow-hidden rounded-full bg-surface/50">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(value / 3) * 100}%` }}
                            transition={{ delay: 0.5 }}
                            className={`h-full rounded-full ${
                              element === "fire"
                                ? "bg-red-500/60"
                                : element === "earth"
                                ? "bg-green-500/60"
                                : element === "air"
                                ? "bg-blue-500/60"
                                : "bg-purple-500/60"
                            }`}
                          />
                        </div>
                      </div>
                      <span className="w-6 text-right text-xs text-txt-muted">{value}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* Modality */}
            <motion.div {...fadeUp} className="mb-5">
              <GlassCard>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-txt-muted">
                  ⚖️ Modality
                </p>
                <div className="flex gap-3">
                  {Object.entries(chart.modality).map(([mode, value]) => (
                    <div key={mode} className="flex-1 text-center">
                      <p className="text-2xl font-bold text-accent">{value}</p>
                      <p className="mt-1 text-xs capitalize text-txt-muted">{mode}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* Tip */}
            {!chart.moonSign && (
              <motion.div {...fadeUp}>
                <GlassCard className="border-accent/15 text-center">
                  <p className="text-sm text-txt-muted">
                    Add your birth time in{" "}
                    <a href="/settings" className="text-accent underline">Settings</a>
                    {" "}for a more complete chart with moon & rising signs.
                  </p>
                </GlassCard>
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </AppShell>
  );
}
