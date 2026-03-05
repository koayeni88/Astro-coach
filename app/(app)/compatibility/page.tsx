"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useProfile } from "@/components/auth-shell";
import {
  AppShell,
  SectionHeader,
  GlassCard,
  GlowButton,
  Collapsible,
  EmptyState,
  SkeletonPage,
  UpgradeBanner,
  PremiumBadge,
  ZODIAC_EMOJIS,
  fadeUp,
  staggerContainer,
} from "@/components/ui";

const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

interface CompatResult {
  userSign: string;
  otherSign: string;
  isBestFriend: boolean;
  friendReason: string | null;
  isBestRomance: boolean;
  romanceReason: string | null;
  reading: string;
  bestFriends: { sign: string; reason: string }[];
  bestRomance: { sign: string; reason: string }[];
}

export default function CompatibilityPage() {
  const { profile, isPremium } = useProfile();
  const [mode, setMode] = useState<"sign" | "birthdate">("sign");
  const [otherSign, setOtherSign] = useState("Aries");
  const [otherBirthDate, setOtherBirthDate] = useState("");
  const [result, setResult] = useState<CompatResult | null>(null);
  const [loading, setLoading] = useState(false);

  const userSign = profile?.sign || "";

  async function checkCompatibility() {
    setLoading(true);
    try {
      const body = mode === "sign" ? { otherSign } : { otherBirthDate };
      const res = await fetch("/api/compatibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) setResult(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <motion.div variants={staggerContainer} initial="initial" animate="animate">
        <SectionHeader
            title="Compatibility"
            subtitle={`See how ${userSign} gets along with others`}
            icon="💫"
          />

          {/* Input */}
          <motion.div {...fadeUp} className="mb-6">
            <GlassCard>
              {/* mode toggle */}
              <div className="mb-4 flex gap-2">
                {(["sign", "birthdate"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`rounded-2xl px-4 py-2 text-xs font-semibold transition-all ${
                      mode === m
                        ? "bg-accent-dim text-accent-bright shadow-glow-sm"
                        : "bg-surface-raised text-txt-muted hover:text-txt-secondary"
                    }`}
                  >
                    {m === "sign" ? "Choose a Sign" : "Use a Birthday"}
                  </button>
                ))}
              </div>

              {mode === "sign" ? (
                <select
                  value={otherSign}
                  onChange={(e) => setOtherSign(e.target.value)}
                  className="input mb-4"
                >
                  {ZODIAC_SIGNS.map((s) => (
                    <option key={s} value={s}>
                      {ZODIAC_EMOJIS[s]} {s}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="date"
                  value={otherBirthDate}
                  onChange={(e) => setOtherBirthDate(e.target.value)}
                  className="input mb-4"
                  max={new Date().toISOString().split("T")[0]}
                />
              )}

              <GlowButton
                className="w-full"
                onClick={checkCompatibility}
                loading={loading}
                disabled={!isPremium || (mode === "birthdate" && !otherBirthDate)}
              >
                {isPremium ? "See Your Match" : "Pro Feature — Upgrade to Check"}
              </GlowButton>

              {!isPremium && (
                <div className="mt-3">
                  <UpgradeBanner />
                </div>
              )}
            </GlassCard>
          </motion.div>

          {/* Results */}
          {result ? (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-4"
            >
              {/* Title pair */}
              <motion.div {...fadeUp}>
                <GlassCard className="text-center">
                  <p className="mb-2 text-4xl">
                    {ZODIAC_EMOJIS[result.userSign]} ✕ {ZODIAC_EMOJIS[result.otherSign]}
                  </p>
                  <p className="text-xl font-bold text-txt">
                    {result.userSign} & {result.otherSign}
                  </p>
                </GlassCard>
              </motion.div>

              {/* Match badges */}
              {(result.isBestFriend || result.isBestRomance) && (
                <motion.div {...fadeUp} className="flex gap-3">
                  {result.isBestFriend && (
                    <GlassCard className="flex-1 border-emerald-500/15 text-center">
                      <span className="mb-1 block text-lg">🤝</span>
                      <p className="text-xs font-bold text-emerald-400">Great Friends</p>
                      <p className="mt-1 text-[11px] text-txt-muted">{result.friendReason}</p>
                    </GlassCard>
                  )}
                  {result.isBestRomance && (
                    <GlassCard className="flex-1 border-pink-500/15 text-center">
                      <span className="mb-1 block text-lg">💕</span>
                      <p className="text-xs font-bold text-pink-400">Strong Romance</p>
                      <p className="mt-1 text-[11px] text-txt-muted">{result.romanceReason}</p>
                    </GlassCard>
                  )}
                </motion.div>
              )}

              {/* Reading */}
              <motion.div {...fadeUp}>
                <Collapsible title="Full Compatibility Reading" icon="🔮" defaultOpen>
                  <p className="text-sm leading-relaxed text-txt-secondary whitespace-pre-line">
                    {result.reading}
                  </p>
                </Collapsible>
              </motion.div>

              {/* Best friends list */}
              <motion.div {...fadeUp}>
                <Collapsible title={`${result.userSign}’s Closest Friend Signs`} icon="🤝">
                  <div className="space-y-2">
                    {result.bestFriends.map((f) => (
                      <div key={f.sign} className="flex items-start gap-3 rounded-2xl bg-surface-raised/50 p-3">
                        <span className="text-xl">{ZODIAC_EMOJIS[f.sign]}</span>
                        <div>
                          <p className="text-sm font-semibold text-txt">{f.sign}</p>
                          <p className="text-xs text-txt-muted">{f.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Collapsible>
              </motion.div>

              {/* Best romance list */}
              <motion.div {...fadeUp}>
                <Collapsible title={`${result.userSign}’s Top Romance Signs`} icon="💕">
                  <div className="space-y-2">
                    {result.bestRomance.map((r) => (
                      <div key={r.sign} className="flex items-start gap-3 rounded-2xl bg-surface-raised/50 p-3">
                        <span className="text-xl">{ZODIAC_EMOJIS[r.sign]}</span>
                        <div>
                          <p className="text-sm font-semibold text-txt">{r.sign}</p>
                          <p className="text-xs text-txt-muted">{r.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Collapsible>
              </motion.div>
            </motion.div>
          ) : (
            !loading && (
              <EmptyState
                icon="💫"
                title="See your match"
                description="Choose a sign or enter a birthday above to see your compatibility"
              />
            )
          )}
        </motion.div>
      </AppShell>
  );
}
