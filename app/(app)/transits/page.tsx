"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useProfile } from "@/components/auth-shell";
import {
  AppShell,
  SectionHeader,
  GlassCard,
  StatPill,
  SkeletonPage,
  fadeUp,
  staggerContainer,
} from "@/components/ui";

interface Transit {
  planet: string;
  sign: string;
  description: string;
  intensity: string;
  isRetrograde: boolean;
}

interface Retrograde {
  planet: string;
  isRetrograde: boolean;
  sign: string;
  description: string;
  advice: string;
}

export default function TransitsPage() {
  const { profile } = useProfile();
  const [transits, setTransits] = useState<Transit[]>([]);
  const [retrogrades, setRetrogrades] = useState<Retrograde[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransits();
  }, []);

  async function loadTransits() {
    try {
      const res = await fetch("/api/transits");
      if (res.ok) {
        const data = await res.json();
        setTransits(data.transits);
        setRetrogrades(data.retrogrades);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <AppShell>
        <SkeletonPage />
      </AppShell>
    );
  }

  const planetEmojis: Record<string, string> = {
    Sun: "☀️", Moon: "🌙", Mercury: "💫", Venus: "💖", Mars: "🔴",
    Jupiter: "🪐", Saturn: "⭕", Uranus: "🌊", Neptune: "🔮", Pluto: "💀",
  };

  const retroPlanets = retrogrades.filter((r) => r.isRetrograde);

  return (
    <AppShell>
      <motion.div variants={staggerContainer} initial="initial" animate="animate">
        <SectionHeader
          title="Cosmic Transits"
          subtitle="Current planetary positions & energies"
          icon="🪐"
        />

        {/* Retrograde Alerts */}
        {retroPlanets.length > 0 && (
          <motion.div {...fadeUp} className="mb-5">
            <GlassCard className="border-red-500/20">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">
                ⚠️ Retrograde Alert
              </p>
              <div className="space-y-2">
                {retroPlanets.map((r) => (
                  <div key={r.planet} className="flex items-start gap-2">
                    <span className="text-lg">{planetEmojis[r.planet] || "🌟"}</span>
                    <div>
                      <p className="text-sm font-semibold text-txt">
                        {r.planet} Retrograde
                      </p>
                      <p className="text-xs text-txt-muted">{r.description}</p>
                      {r.advice && (
                        <p className="mt-1 text-[10px] text-accent/80">💡 {r.advice}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Current Transits */}
        <motion.div {...fadeUp} className="mb-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-txt-muted">
            Planetary Positions
          </p>
          <div className="space-y-3">
            {transits.map((transit) => (
              <GlassCard key={transit.planet} className="flex items-start gap-3 !p-4">
                <span className="text-2xl">{planetEmojis[transit.planet] || "🌟"}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-txt">{transit.planet}</p>
                    <StatPill label={`in ${transit.sign}`} />
                    {retrogrades.find((r) => r.planet === transit.planet && r.isRetrograde) && (
                      <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] text-red-400">
                        Rx
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-txt-muted">{transit.description}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </motion.div>

        {/* Legend */}
        <motion.div {...fadeUp}>
          <GlassCard className="!p-3">
            <p className="text-center text-[10px] text-txt-muted">
              Rx = Retrograde · Positions are approximate cosmic alignments
            </p>
          </GlassCard>
        </motion.div>
      </motion.div>
    </AppShell>
  );
}
