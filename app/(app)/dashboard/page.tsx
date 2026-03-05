"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useProfile } from "@/components/auth-shell";
import {
  AppShell,
  SectionHeader,
  GlassCard,
  SkeletonPage,
  UpgradeBanner,
  ZODIAC_EMOJIS,
  ZODIAC_ELEMENTS,
  ELEMENT_COLORS,
  StatPill,
  fadeUp,
  staggerContainer,
} from "@/components/ui";

interface DailyReading {
  quote: string;
  theme: string;
  isGated: boolean;
  affirmation?: string;
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
}

const quickLinks = [
  { href: "/sign-profile", icon: "⭐", label: "Your Sign", desc: "Strengths, style & tips" },
  { href: "/daily", icon: "🌙", label: "Today", desc: "Your daily insight" },
  { href: "/compatibility", icon: "💫", label: "Compatibility", desc: "See who you click with" },
  { href: "/chat", icon: "💬", label: "Ask Coach", desc: "Get personal guidance" },
  { href: "/tarot", icon: "🃏", label: "Tarot", desc: "Pull your daily card" },
  { href: "/birth-chart", icon: "🌌", label: "Birth Chart", desc: "Your cosmic blueprint" },
  { href: "/weekly", icon: "📅", label: "Weekly", desc: "This week's forecast" },
  { href: "/transits", icon: "🪐", label: "Transits", desc: "Planetary movements" },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const { profile } = useProfile();
  const router = useRouter();
  const [daily, setDaily] = useState<DailyReading | null>(null);
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([loadDaily(), loadStreak()]).finally(() => setLoading(false));
  }, []);

  async function loadDaily() {
    try {
      const res = await fetch("/api/daily");
      if (res.ok) setDaily(await res.json());
    } catch (e) {
      console.error(e);
    }
  }

  async function loadStreak() {
    try {
      const res = await fetch("/api/streak", { method: "POST" });
      if (res.ok) setStreak(await res.json());
    } catch (e) {
      console.error(e);
    }
  }

  if (loading || !profile) {
    return (
      <AppShell>
        <SkeletonPage />
      </AppShell>
    );
  }

  const element = ZODIAC_ELEMENTS[profile.sign] || "";

  return (
    <AppShell>
      <motion.div variants={staggerContainer} initial="initial" animate="animate">
        <SectionHeader
          title={`Hey, ${session?.user?.name || "Star"}`}
          subtitle={`${profile.sign} · ${element} · Focused on ${profile.focusArea}`}
          icon={ZODIAC_EMOJIS[profile.sign]}
        />

        {/* Today's Quote */}
        {daily && (
          <motion.div {...fadeUp} className="mb-5">
            <GlassCard className="relative overflow-hidden border-accent/15">
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/8 blur-2xl" />
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-txt-muted">
                Today&apos;s Message
              </p>
              <p className="text-lg font-semibold leading-relaxed text-txt">
                &ldquo;{daily.quote}&rdquo;
              </p>
              {daily.theme && (
                <div className="mt-3 flex items-center gap-2">
                  <StatPill label={daily.theme} />
                  <span className={`text-xs ${ELEMENT_COLORS[element] || "text-txt-muted"}`}>
                    {element} energy
                  </span>
                </div>
              )}
            </GlassCard>
          </motion.div>
        )}

        {/* Streak + Affirmation */}
        <motion.div {...fadeUp} className="mb-5 flex gap-3">
          {streak && streak.currentStreak > 0 && (
            <GlassCard className="flex-1 text-center border-orange-500/15">
              <span className="block text-2xl">🔥</span>
              <p className="mt-1 text-xl font-bold text-txt">{streak.currentStreak}</p>
              <p className="text-[10px] text-txt-muted">day streak</p>
            </GlassCard>
          )}
          {daily?.affirmation && (
            <GlassCard className="flex-[2] border-purple-500/10">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-purple-400">
                ✨ Affirmation
              </p>
              <p className="text-sm italic text-txt">&ldquo;{daily.affirmation}&rdquo;</p>
            </GlassCard>
          )}
        </motion.div>

        {/* Quick Links */}
        <motion.div {...fadeUp} className="mb-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-txt-muted">
            Explore
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <GlassCard hover className="text-center">
                  <span className="mb-2 block text-3xl">{link.icon}</span>
                  <p className="text-sm font-semibold text-txt">{link.label}</p>
                  <p className="mt-0.5 text-[11px] text-txt-muted">{link.desc}</p>
                </GlassCard>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions Row */}
        <motion.div {...fadeUp} className="mb-5 flex gap-3">
          <Link href="/journal" className="flex-1">
            <GlassCard hover className="text-center !py-3 border-green-500/10">
              <span className="text-xl">📓</span>
              <p className="mt-1 text-xs font-semibold text-txt">Journal</p>
            </GlassCard>
          </Link>
          <Link href="/mood" className="flex-1">
            <GlassCard hover className="text-center !py-3 border-blue-500/10">
              <span className="text-xl">🌊</span>
              <p className="mt-1 text-xs font-semibold text-txt">Mood</p>
            </GlassCard>
          </Link>
          <Link href="/bookmarks" className="flex-1">
            <GlassCard hover className="text-center !py-3 border-yellow-500/10">
              <span className="text-xl">🔖</span>
              <p className="mt-1 text-xs font-semibold text-txt">Saved</p>
            </GlassCard>
          </Link>
          <Link href="/monthly" className="flex-1">
            <GlassCard hover className="text-center !py-3 border-purple-500/10">
              <span className="text-xl">🗓️</span>
              <p className="mt-1 text-xs font-semibold text-txt">Monthly</p>
            </GlassCard>
          </Link>
        </motion.div>

        {daily?.isGated && (
          <motion.div {...fadeUp}>
            <UpgradeBanner onUpgrade={() => router.push("/settings")} />
          </motion.div>
        )}
      </motion.div>
    </AppShell>
  );
}
