"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const features = [
  { icon: "♈", title: "Your Sign", desc: "Personalized zodiac profile" },
  { icon: "🌙", title: "Daily Insight", desc: "Fresh guidance every morning" },
  { icon: "💫", title: "Compatibility", desc: "See who you click with" },
  { icon: "💬", title: "Coach Chat", desc: "Ask anything, anytime" },
];

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center">
      {/* decorative blurs */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/8 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-20 right-1/4 h-48 w-48 rounded-full bg-astro-teal/6 blur-[100px]" />

      <motion.div initial="initial" animate="animate" transition={{ staggerChildren: 0.1 }} className="relative z-10 max-w-lg">
        <motion.p {...fadeUp} transition={{ duration: 0.5 }} className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-accent-bright">
          Personalized Astrology
        </motion.p>

        <motion.h1 {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }} className="mb-4 text-5xl font-bold tracking-tight text-txt md:text-6xl">
          Astro Coach
        </motion.h1>

        <motion.p {...fadeUp} transition={{ duration: 0.5, delay: 0.2 }} className="mx-auto mb-10 max-w-sm text-base leading-relaxed text-txt-secondary">
          Your daily reading, sign insights, compatibility tools, and a personal astrology coach—all in one place.
        </motion.p>

        {/* feature pills */}
        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.3 }} className="mb-10 flex flex-wrap justify-center gap-2">
          {features.map((f) => (
            <span key={f.title} className="stat-pill">
              <span>{f.icon}</span> {f.title}
            </span>
          ))}
        </motion.div>

        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.4 }} className="flex justify-center gap-3">
          <Link href="/login" className="btn-glow px-8 py-3 text-sm">
            Sign In
          </Link>
          <Link href="/register" className="btn-ghost px-8 py-3 text-sm">
            Create Account
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
