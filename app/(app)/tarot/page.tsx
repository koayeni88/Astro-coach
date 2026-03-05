"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "@/components/auth-shell";
import {
  AppShell,
  SectionHeader,
  GlassCard,
  GlowButton,
  SkeletonPage,
  fadeUp,
  staggerContainer,
  scaleIn,
  useToast,
} from "@/components/ui";

interface TarotCard {
  name: string;
  arcana: string;
  meaning: string;
  reversed: string;
  advice: string;
  isReversed: boolean;
}

const SPREAD_OPTIONS = [
  { count: 1, label: "Single Card", description: "Quick daily guidance" },
  { count: 3, label: "Three-Card Spread", description: "Past • Present • Future" },
  { count: 5, label: "Five-Card Spread", description: "Deeper insight reading" },
] as const;

const SPREAD_LABELS: Record<number, string[]> = {
  3: ["Past", "Present", "Future"],
  5: ["Context", "Challenge", "Focus", "Advice", "Outcome"],
};

export default function TarotPage() {
  const { profile } = useProfile();
  const { toast } = useToast();
  const [cards, setCards] = useState<TarotCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [spreadCount, setSpreadCount] = useState(1);

  async function pullCards(count: number) {
    setLoading(true);
    setRevealed(false);
    setSpreadCount(count);
    try {
      const res = await fetch(`/api/tarot?count=${count}`);
      if (res.ok) {
        const data = await res.json();
        setCards(data.cards);
        // Dramatic reveal delay
        setTimeout(() => setRevealed(true), 800);
      }
    } catch (e) {
      console.error(e);
      toast("Failed to pull cards");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <motion.div variants={staggerContainer} initial="initial" animate="animate">
        <SectionHeader
          title="Daily Tarot"
          subtitle="Let the cards reveal your cosmic message"
          icon="🃏"
        />

        {/* Pull Cards */}
        {cards.length === 0 && !loading && (
          <motion.div {...fadeUp} className="mb-5 flex flex-col items-center">
            <div className="relative mb-6">
              <motion.div
                animate={{ rotateY: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="mx-auto h-64 w-44 rounded-xl bg-gradient-to-br from-purple-900/50 via-indigo-900/50 to-purple-900/50 p-4 ring-1 ring-accent/20 flex items-center justify-center"
              >
                <div className="text-center">
                  <span className="block text-5xl mb-3">✨</span>
                  <p className="text-xs text-txt-muted">Choose a spread</p>
                </div>
              </motion.div>
            </div>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              {SPREAD_OPTIONS.map((opt) => (
                <GlowButton key={opt.count} onClick={() => pullCards(opt.count)}>
                  🔮 {opt.label}
                  <span className="block text-[10px] font-normal opacity-70">{opt.description}</span>
                </GlowButton>
              ))}
            </div>
          </motion.div>
        )}

        {/* Loading Animation */}
        {loading && (
          <motion.div {...fadeUp} className="flex flex-col items-center py-10">
            <motion.div
              animate={{ rotateY: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="mb-4 text-6xl"
            >
              🃏
            </motion.div>
            <p className="text-sm text-txt-muted">
              {spreadCount === 1
                ? "The cosmos is choosing your card..."
                : `The cosmos is choosing your ${spreadCount} cards...`}
            </p>
          </motion.div>
        )}

        {/* Revealed Cards */}
        <AnimatePresence>
          {cards.length > 0 && revealed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-5"
            >
              {spreadCount > 1 && SPREAD_LABELS[spreadCount] && (
                <motion.div {...fadeUp} className="mb-4 flex justify-center gap-2 flex-wrap">
                  {SPREAD_LABELS[spreadCount].map((label) => (
                    <span key={label} className="text-[10px] font-bold uppercase tracking-[0.15em] text-accent/70">
                      {label}
                    </span>
                  ))}
                </motion.div>
              )}

              <div className={`grid gap-4 ${
                spreadCount === 1 ? "grid-cols-1" :
                spreadCount === 3 ? "grid-cols-1 sm:grid-cols-3" :
                "grid-cols-1 sm:grid-cols-3 lg:grid-cols-5"
              }`}>
                {cards.map((card, i) => {
                  const posLabel = SPREAD_LABELS[spreadCount]?.[i];
                  return (
                    <motion.div
                      key={`${card.name}-${i}`}
                      initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
                      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                      transition={{ type: "spring", duration: 0.8, delay: i * 0.2 }}
                    >
                      <GlassCard className="border-accent/20 text-center h-full">
                        <div className="mb-3">
                          {posLabel && (
                            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-accent/60">
                              {posLabel}
                            </p>
                          )}
                          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                            {card.isReversed ? "Reversed" : "Upright"} • {card.arcana} Arcana
                          </p>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 + i * 0.15 }}
                          >
                            <span className={`block text-5xl mb-2 ${card.isReversed ? "rotate-180" : ""}`}>
                              🃏
                            </span>
                          </motion.div>
                          <h2 className={`font-bold text-txt ${spreadCount === 1 ? "text-xl" : "text-base"}`}>
                            {card.name}
                          </h2>
                        </div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + i * 0.15 }}
                        >
                          <p className="mb-3 text-sm leading-relaxed text-txt/80">
                            {card.advice}
                          </p>
                          <div className="rounded-lg bg-surface/50 p-3">
                            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-txt-muted">
                              {card.isReversed ? "Reversed Meaning" : "Today's Message"}
                            </p>
                            <p className="text-sm font-medium text-txt">
                              {card.isReversed ? card.reversed : card.meaning}
                            </p>
                          </div>
                        </motion.div>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-4 flex justify-center gap-3">
                <GlowButton onClick={() => { setCards([]); setRevealed(false); }} variant="secondary">
                  New Spread
                </GlowButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AppShell>
  );
}
