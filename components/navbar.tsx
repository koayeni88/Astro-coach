"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { useProfile } from "./auth-shell";
import { ZODIAC_EMOJIS } from "./ui";

/* ------------------------------------------------------------------ */
/*  NAV ITEMS                                                          */
/* ------------------------------------------------------------------ */
const navItems = [
  { href: "/dashboard", label: "Home", icon: "✨" },
  { href: "/daily", label: "Daily", icon: "🌙" },
  { href: "/compatibility", label: "Match", icon: "💫" },
  { href: "/chat", label: "Chat", icon: "💬" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

// Additional nav items shown only in the desktop sidebar
const sidebarExtraItems = [
  { href: "/weekly", label: "Weekly", icon: "📅" },
  { href: "/monthly", label: "Monthly", icon: "🗓️" },
  { href: "/tarot", label: "Tarot", icon: "🃏" },
  { href: "/birth-chart", label: "Birth Chart", icon: "🌌" },
  { href: "/transits", label: "Transits", icon: "🪐" },
  { href: "/journal", label: "Journal", icon: "📓" },
  { href: "/mood", label: "Mood", icon: "🌊" },
  { href: "/bookmarks", label: "Bookmarks", icon: "🔖" },
];

/* ------------------------------------------------------------------ */
/*  APP NAVIGATION — responsive: mobile header+bottom / desktop sidebar*/
/* ------------------------------------------------------------------ */
export function AppNavigation() {
  const pathname = usePathname();
  const { profile, isPremium } = useProfile();

  const signEmoji = profile?.sign ? ZODIAC_EMOJIS[profile.sign] : null;

  return (
    <>
      {/* ─── Mobile Top Bar ─── */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-surface-glass/70 backdrop-blur-xl md:hidden" role="banner">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
          <Link
            href="/dashboard"
            className="text-base font-bold tracking-tight text-txt"
          >
            <span className="text-accent-bright">✦</span> Astro Coach
          </Link>

          <div className="flex items-center gap-2">
            {/* Plan badge */}
            <Link
              href="/settings"
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold transition-colors ${
                isPremium
                  ? "border border-astro-gold/30 bg-astro-gold/10 text-astro-gold"
                  : "border border-border bg-surface-raised/60 text-txt-muted hover:text-txt-secondary"
              }`}
            >
              {isPremium ? "✦ Pro" : "Free"}
            </Link>
            {/* Today shortcut */}
            {pathname !== "/daily" && (
              <Link
                href="/daily"
                aria-label="Today's insight"
                className="rounded-full border border-accent/20 bg-accent/8 px-2.5 py-1 text-[10px] font-bold text-accent-bright transition-colors hover:bg-accent/15"
              >
                Today
              </Link>
            )}
            {/* Sign pill */}
            {profile?.sign && (
              <Link
                href="/sign-profile"
                aria-label={`${profile.sign} sign profile`}
                className="flex items-center gap-1.5 rounded-full border border-border bg-surface-raised/60 px-2.5 py-1 text-[11px] font-medium text-txt-secondary transition-colors hover:border-border-accent"
              >
                <span>{signEmoji}</span>
                <span className="hidden min-[380px]:inline">{profile.sign}</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ─── Desktop Sidebar ─── */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-60 flex-col border-r border-border bg-surface/95 backdrop-blur-xl md:flex">
        {/* Brand */}
        <div className="flex h-16 items-center border-b border-border px-5">
          <Link href="/dashboard" className="text-lg font-bold tracking-tight text-txt">
            <span className="text-accent-bright">✦</span> Astro Coach
          </Link>
        </div>

        {/* Sign card */}
        {profile?.sign && (
          <Link
            href="/sign-profile"
            className="mx-3 mt-4 flex items-center gap-3 rounded-2xl border border-border bg-surface-raised/50 px-3.5 py-3 transition-colors hover:border-border-accent"
          >
            <span className="text-2xl">{signEmoji}</span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-txt">{profile.sign}</p>
              <p className="text-[10px] text-txt-muted">Your sign profile →</p>
            </div>
          </Link>
        )}

        {/* Plan badge — desktop sidebar */}
        <Link
          href="/settings"
          className={`mx-3 mt-2 flex items-center justify-center rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
            isPremium
              ? "border border-astro-gold/25 bg-astro-gold/8 text-astro-gold hover:bg-astro-gold/15"
              : "border border-border bg-surface-raised/40 text-txt-muted hover:bg-surface-glass/40 hover:text-txt-secondary"
          }`}
        >
          {isPremium ? "✦ Pro Plan" : "Free Plan — Upgrade"}
        </Link>

        {/* Nav links */}
        <nav aria-label="Main navigation" className="mt-5 flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "text-accent-bright"
                    : "text-txt-muted hover:bg-surface-glass/40 hover:text-txt-secondary"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-pill"
                    className="absolute inset-0 rounded-xl border border-accent/20 bg-accent/10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative text-base">{item.icon}</span>
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}

          {/* Today shortcut */}
          {pathname !== "/daily" && (
            <Link
              href="/daily"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-astro-gold transition-all hover:bg-astro-gold/8"
            >
              <span className="text-base">📅</span>
              <span>Today&apos;s Insight</span>
            </Link>
          )}

          {/* Divider */}
          <div className="my-2 border-t border-border/50" />

          {/* Extra nav items */}
          {sidebarExtraItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition-all ${
                  isActive
                    ? "text-accent-bright"
                    : "text-txt-muted hover:bg-surface-glass/40 hover:text-txt-secondary"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-pill-extra"
                    className="absolute inset-0 rounded-xl border border-accent/20 bg-accent/10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative text-sm">{item.icon}</span>
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="border-t border-border p-3">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            aria-label="Sign out"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-txt-muted transition-colors hover:bg-surface-glass/40 hover:text-txt-secondary"
          >
            <span className="text-base">🚪</span>
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* ─── Mobile Bottom Navigation ─── */}
      <nav aria-label="Main navigation" className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/90 backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-2xl justify-around py-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
                className="relative flex flex-col items-center gap-0.5 px-3 py-1.5"
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-2xl bg-accent/10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span
                  className={`relative text-lg transition-transform ${
                    isActive ? "scale-110" : ""
                  }`}
                >
                  {item.icon}
                </span>
                <span
                  className={`relative text-[10px] font-semibold transition-colors ${
                    isActive ? "text-accent-bright" : "text-txt-muted"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
