"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "@/components/auth-shell";
import {
  AppShell,
  SectionHeader,
  GlassCard,
  GlowButton,
  Collapsible,
  PremiumBadge,
  UpgradeBanner,
  ShareDailyCard,
  SkeletonPage,
  ConfirmDialog,
  ZODIAC_EMOJIS,
  fadeUp,
  staggerContainer,
  useToast,
} from "@/components/ui";

interface DailyReading {
  sign: string;
  date: string;
  quote: string;
  theme: string;
  readingText: string;
  action: string;
  avoid: string;
  isGated: boolean;
}

export default function DailyPage() {
  const { profile, isPremium } = useProfile();
  const router = useRouter();
  const { toast } = useToast();
  const [reading, setReading] = useState<DailyReading | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    loadReading();
  }, []);

  async function loadReading() {
    try {
      const res = await fetch("/api/daily");
      if (res.ok) setReading(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function refreshReading() {
    setShowConfirm(false);
    setRefreshing(true);
    try {
      const res = await fetch("/api/daily/generate", { method: "POST" });
      if (res.ok) {
        await loadReading();
        toast("New reading ready", "success");
      }
    } catch (e) {
      console.error(e);
      toast("Failed to refresh", "error");
    } finally {
      setRefreshing(false);
    }
  }

  // isPremium is now provided by global context (useProfile)

  if (loading) {
    return (
      <AppShell>
        <SkeletonPage />
      </AppShell>
    );
  }

  if (!reading) return null;

  return (
    <AppShell>
      <motion.div variants={staggerContainer} initial="initial" animate="animate">
        <SectionHeader
          title="Daily Reading"
          subtitle={`${reading.sign} · ${reading.date}`}
          icon={ZODIAC_EMOJIS[reading.sign] || "🌙"}
        />

        {/* Quote / Share Card */}
        <motion.div {...fadeUp} className="mb-5">
          <AnimatePresence mode="wait">
            {showShareCard ? (
              <motion.div
                key="share"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <ShareDailyCard
                  quote={reading.quote}
                  sign={reading.sign}
                  theme={reading.theme}
                  date={reading.date}
                />
                <div className="mt-3 flex justify-center gap-2">
                  <GlowButton
                    size="sm"
                    onClick={() => {
                      navigator.clipboard?.writeText(
                        `"${reading.quote}" — ${reading.sign} · Astro Coach`
                      );
                      toast("Copied to clipboard", "success");
                    }}
                  >
                    Copy Quote
                  </GlowButton>
                  <GlowButton
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowShareCard(false)}
                  >
                    Close
                  </GlowButton>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="quote"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <GlassCard className="relative overflow-hidden border-accent/15 text-center">
                  <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-accent/8 blur-3xl" />
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-txt-muted">
                    Today&apos;s Quote
                  </p>
                  <p className="text-xl font-semibold leading-relaxed text-txt">
                    &ldquo;{reading.quote}&rdquo;
                  </p>
                  <p className="mt-3 text-xs text-txt-secondary">
                    Theme: <span className="font-medium text-accent-bright">{reading.theme}</span>
                  </p>
                  <button
                    onClick={() => setShowShareCard(true)}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-accent-bright transition-colors hover:text-accent"
                  >
                    Share this
                  </button>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Full Reading */}
        <motion.div {...fadeUp} className="mb-4">
          <Collapsible title="Full Reading" icon="📖" defaultOpen>
            <p className="text-sm leading-relaxed text-txt-secondary whitespace-pre-line">
              {reading.readingText}
            </p>
          </Collapsible>
        </motion.div>

        {/* Action & Avoid */}
        <motion.div {...fadeUp} className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <GlassCard className="border-emerald-500/15">
            <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
              Try This Today
            </h3>
            <p className="text-sm text-txt-secondary">{reading.action}</p>
          </GlassCard>
          <GlassCard className="border-amber-500/15">
            <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
              Heads Up
              {reading.isGated && <PremiumBadge />}
            </h3>
            <p className="text-sm text-txt-secondary">{reading.avoid}</p>
          </GlassCard>
        </motion.div>

        {reading.isGated && (
          <motion.div {...fadeUp} className="mb-4">
            <UpgradeBanner onUpgrade={() => router.push("/settings")} />
          </motion.div>
        )}

        {/* Regenerate — premium only */}
        <motion.div {...fadeUp}>
          {isPremium ? (
            <GlowButton
              variant="gold"
              className="w-full"
              onClick={() => setShowConfirm(true)}
              loading={refreshing}
            >
              Regenerate
            </GlowButton>
          ) : (
            <div className="rounded-2xl border border-border bg-surface-raised/30 px-4 py-3 text-center">
              <p className="text-xs text-txt-muted">
                <PremiumBadge /> Regenerate is available on Premium
              </p>
              <button
                onClick={() => router.push("/settings")}
                className="mt-1.5 text-xs font-medium text-astro-gold transition-colors hover:text-amber-300"
              >
                See plans →
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={showConfirm}
        title="Regenerate this reading?"
        description="This will replace today’s reading with a new one. Your current reading won’t be saved."
        confirmLabel="Regenerate"
        cancelLabel="Keep Current"
        onConfirm={refreshReading}
        onCancel={() => setShowConfirm(false)}
      />
    </AppShell>
  );
}
