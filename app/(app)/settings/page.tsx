"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useProfile } from "@/components/auth-shell";
import {
  AppShell,
  SectionHeader,
  GlassCard,
  GlowButton,
  PremiumBadge,
  ConfirmDialog,
  ZODIAC_EMOJIS,
  fadeUp,
  staggerContainer,
  useToast,
} from "@/components/ui";

interface SubInfo {
  tier: string;
  aiMessagesLimit: number;
}

interface NotifPrefs {
  emailDailyReading: boolean;
  emailWeeklyDigest: boolean;
  pushEnabled: boolean;
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const { profile, refreshProfile, subscription, isPremium, refreshSubscription } = useProfile();
  const [upgrading, setUpgrading] = useState(false);

  const [focusArea, setFocusArea] = useState(profile?.focusArea || "peace");
  const [mood, setMood] = useState(profile?.mood || "neutral");
  const [struggle, setStruggle] = useState(profile?.struggle || "none");
  const [birthTime, setBirthTime] = useState(profile?.birthTime || "");
  const [birthPlace, setBirthPlace] = useState(profile?.birthPlace || "");
  const [saving, setSaving] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState<NotifPrefs | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (profile) {
      setFocusArea(profile.focusArea);
      setMood(profile.mood);
      setStruggle(profile.struggle);
      setBirthTime(profile.birthTime || "");
      setBirthPlace(profile.birthPlace || "");
    }
  }, [profile]);

  useEffect(() => {
    loadNotifPrefs();
  }, []);

  async function loadNotifPrefs() {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) setNotifPrefs(await res.json());
    } catch (e) {
      console.error(e);
    }
  }

  async function updateNotifPref(key: keyof NotifPrefs, value: boolean) {
    setNotifPrefs((prev) => prev ? { ...prev, [key]: value } : null);
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: value }),
      });
    } catch (e) {
      console.error(e);
    }
  }

  async function handleUpgrade() {
    setUpgrading(true);
    try {
      const res = await fetch("/api/subscription/upgrade", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        await refreshSubscription();
        toast(data.message, "success");
      }
    } catch {
      toast("Failed to update subscription", "error");
    } finally {
      setUpgrading(false);
    }
  }

  async function handleSaveProfile() {
    if (!profile) return;
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birthDate: profile.birthDate,
          focusArea,
          mood,
          struggle,
          birthTime: birthTime || undefined,
          birthPlace: birthPlace || undefined,
        }),
      });
      if (res.ok) {
        await refreshProfile();
        toast("Profile updated", "success");
      }
    } catch {
      toast("Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  }

  if (!profile) return null;

  return (
    <AppShell>
      <motion.div variants={staggerContainer} initial="initial" animate="animate">
        <SectionHeader
            title="Settings"
            subtitle={`${session?.user?.name} · ${session?.user?.email}`}
            icon="⚙️"
          />

          {/* Subscription */}
          <motion.div {...fadeUp} className="mb-5">
            <GlassCard className={isPremium ? "border-astro-gold/20" : ""}>
              {isPremium && (
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-astro-gold/50 to-transparent" />
              )}
              <div className="mb-1 flex items-center gap-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-txt-secondary">
                  Your Plan
                </h2>
                {isPremium && <PremiumBadge />}
              </div>

              <div className="mt-3 flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-txt">
                    {isPremium ? "Pro" : "Free"} Plan
                  </p>
                  <p className="mt-0.5 text-xs text-txt-muted">
                    {isPremium
                      ? "50 messages/day · Full readings · Regenerate · All features"
                      : "3 messages/day · Partial readings · Limited features"}
                  </p>
                </div>
                <GlowButton
                  variant={isPremium ? "ghost" : "gold"}
                  size="sm"
                  onClick={handleUpgrade}
                  loading={upgrading}
                >
                  {isPremium ? "Switch to Free" : "Upgrade ✦"}
                </GlowButton>
              </div>

              {/* Plan comparison */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className={`rounded-xl border px-3 py-3 ${!isPremium ? "border-accent/20 bg-accent/5" : "border-border bg-surface-raised/30"}`}>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-txt-secondary">Free</p>
                  <ul className="space-y-1.5 text-[11px] text-txt-muted">
                    <li className="flex items-center gap-1.5">
                      <span className="text-emerald-400">✓</span> Daily quote
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-emerald-400">✓</span> 3 AI messages/day
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-txt-dim">—</span> <span className="text-txt-dim">Partial readings only</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-txt-dim">—</span> <span className="text-txt-dim">No regenerate</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-txt-dim">—</span> <span className="text-txt-dim">Basic sign profile</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-txt-dim">—</span> <span className="text-txt-dim">No compatibility</span>
                    </li>
                  </ul>
                </div>
                <div className={`rounded-xl border px-3 py-3 ${isPremium ? "border-astro-gold/25 bg-astro-gold/5" : "border-border bg-surface-raised/30"}`}>
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-astro-gold">✦ Pro</p>
                  <ul className="space-y-1.5 text-[11px] text-txt-muted">
                    <li className="flex items-center gap-1.5">
                      <span className="text-emerald-400">✓</span> Daily quote
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-emerald-400">✓</span> 50 AI messages/day
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-emerald-400">✓</span> Full readings & insights
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-emerald-400">✓</span> Regenerate readings
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-emerald-400">✓</span> Full sign profile (25+ sections)
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-emerald-400">✓</span> Compatibility checker
                    </li>
                  </ul>
                </div>
              </div>

              <p className="mt-3 text-[10px] text-txt-dim">
                This is a demo — tier changes are instant, no payment required.
              </p>
            </GlassCard>
          </motion.div>

          {/* Profile */}
          <motion.div {...fadeUp} className="mb-5">
            <GlassCard>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-txt-secondary">
                Profile
              </h2>

              <div className="mb-4 flex items-center gap-3">
                <span className="text-2xl">{ZODIAC_EMOJIS[profile.sign]}</span>
                <div>
                  <p className="font-semibold text-txt">{profile.sign}</p>
                  <p className="text-xs text-txt-muted">Born {profile.birthDate}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="label">What you’re focused on</label>
                  <select
                    value={focusArea}
                    onChange={(e) => setFocusArea(e.target.value)}
                    className="input"
                  >
                    <option value="love">❤️ Love</option>
                    <option value="career">💼 Career</option>
                    <option value="money">💰 Money</option>
                    <option value="peace">☮️ Peace</option>
                  </select>
                </div>

                <div>
                  <label className="label">Current mood</label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    className="input"
                  >
                    {["happy","anxious","motivated","reflective","confused","neutral","sad","excited","intense","peaceful"].map((m) => (
                      <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Working through</label>
                  <select
                    value={struggle}
                    onChange={(e) => setStruggle(e.target.value)}
                    className="input"
                  >
                    {["none","patience","trust","vulnerability","direction","confidence","boundaries","letting-go","communication","balance"].map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).replace("-", " ")}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Birth Time (optional — for moon/rising signs)</label>
                  <input
                    type="time"
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Birth Place (optional)</label>
                  <input
                    type="text"
                    value={birthPlace}
                    onChange={(e) => setBirthPlace(e.target.value)}
                    className="input"
                    placeholder="City, Country"
                  />
                </div>

                <GlowButton
                  className="w-full"
                  onClick={handleSaveProfile}
                  loading={saving}
                >
                  Save
                </GlowButton>
              </div>
            </GlassCard>
          </motion.div>

          {/* Notification Preferences */}
          {notifPrefs && (
            <motion.div {...fadeUp} className="mb-5">
              <GlassCard>
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-txt-secondary">
                  Notifications
                </h2>
                <div className="space-y-3">
                  {[
                    { key: "emailDailyReading" as const, label: "Daily Reading Emails", icon: "🌙" },
                    { key: "emailWeeklyDigest" as const, label: "Weekly Digest Emails", icon: "📅" },
                    { key: "pushEnabled" as const, label: "Push Notifications", icon: "🔔" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{item.icon}</span>
                        <span className="text-sm text-txt">{item.label}</span>
                      </div>
                      <button
                        onClick={() => updateNotifPref(item.key, !notifPrefs[item.key])}
                        className={`relative h-6 w-11 rounded-full transition-colors ${
                          notifPrefs[item.key] ? "bg-accent" : "bg-surface"
                        }`}
                      >
                        <span
                          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                            notifPrefs[item.key] ? "translate-x-5" : ""
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Danger Zone */}
          <motion.div {...fadeUp} className="mb-5">
            <GlassCard className="border-red-500/10">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-red-400">
                Danger Zone
              </h2>
              <p className="mb-3 text-xs text-txt-muted">
                Permanently delete your account and all associated data. This cannot be undone.
              </p>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/20"
              >
                Delete Account
              </button>
            </GlassCard>
          </motion.div>

          <ConfirmDialog
            open={showDeleteConfirm}
            title="Delete Account?"
            description="This will permanently delete your account, profile, messages, and all data. This action cannot be undone."
            confirmLabel="Delete Forever"
            onConfirm={async () => {
              setDeleting(true);
              try {
                const res = await fetch("/api/account/delete", {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ confirm: "DELETE" }),
                });
                if (res.ok) {
                  await signOut({ callbackUrl: "/" });
                } else {
                  toast("Failed to delete account", "error");
                }
              } catch {
                toast("Failed to delete account", "error");
              } finally {
                setDeleting(false);
                setShowDeleteConfirm(false);
              }
            }}
            onCancel={() => setShowDeleteConfirm(false)}
          />
        </motion.div>
      </AppShell>
  );
}
