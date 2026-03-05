"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useProfile } from "@/components/auth-shell";
import {
  AppShell,
  SectionHeader,
  GlassCard,
  Collapsible,
  StatPill,
  SkeletonPage,
  UpgradeBanner,
  PremiumBadge,
  ZODIAC_EMOJIS,
  ZODIAC_ELEMENTS,
  ELEMENT_COLORS,
  fadeUp,
  staggerContainer,
} from "@/components/ui";
import type { SignData } from "@/lib/zodiac-data";

/* ---------- tiny helpers ---------- */
function Pill({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}

function Paragraph({ text }: { text: string }) {
  return <p className="text-sm leading-relaxed text-txt-secondary">{text}</p>;
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-accent-bright/80">
      {children}
    </h3>
  );
}

/* ---------- main page ---------- */
export default function SignProfilePage() {
  const { profile, isPremium } = useProfile();
  const [data, setData] = useState<SignData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.sign) loadSignData(profile.sign);
  }, [profile?.sign]);

  async function loadSignData(sign: string) {
    try {
      const res = await fetch(`/api/sign-profile?sign=${sign}`);
      if (res.ok) setData(await res.json());
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

  if (!data) return null;

  const element = ZODIAC_ELEMENTS[profile.sign] || "";
  const d = data;

  return (
    <AppShell>
      <motion.div variants={staggerContainer} initial="initial" animate="animate">
        {/* Header */}
        <SectionHeader
          title={d.sign}
          subtitle={`${d.emoji} ${element} · ${d.modality} · Ruled by ${d.rulingPlanet}`}
          icon={ZODIAC_EMOJIS[profile.sign]}
          trailing={<StatPill label={element} className={ELEMENT_COLORS[element] || ""} />}
        />

        {/* Quick stats row */}
        <motion.div {...fadeUp} className="mb-4 flex flex-wrap gap-2">
          <Pill className="border-accent/20 bg-accent/8 text-accent-bright">{d.dateRange}</Pill>
          <Pill className="border-purple-500/20 bg-purple-500/8 text-purple-400">{d.houseName}</Pill>
          <Pill className="border-cyan-500/20 bg-cyan-500/8 text-cyan-400">{d.tarotCard}</Pill>
          <Pill className="border-txt-muted/20 bg-txt-muted/8 text-txt-muted">
            &ldquo;{d.motto}&rdquo;
          </Pill>
        </motion.div>

        {/* Overview */}
        <motion.div {...fadeUp} className="mb-4">
          <GlassCard className="relative overflow-hidden">
            <div className="pointer-events-none absolute -left-6 -top-6 h-20 w-20 rounded-full bg-accent/6 blur-2xl" />
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-accent-bright">
              Overview
            </h2>
            <Paragraph text={d.overview} />
          </GlassCard>
        </motion.div>

        {/* Personality — Core */}
        <motion.div {...fadeUp} className="mb-4">
          <Collapsible title="Who You Are" icon="🧬" defaultOpen>
            <Paragraph text={d.personality.core} />
          </Collapsible>
        </motion.div>

        {/* Light & Shadow */}
        <motion.div {...fadeUp} className="mb-4">
          <Collapsible title="Light Side" icon="☀️">
            <Paragraph text={d.personality.lightSide} />
          </Collapsible>
        </motion.div>

        <motion.div {...fadeUp} className="mb-4">
          <Collapsible title="Shadow Side" icon="🌑">
            <Paragraph text={d.personality.shadowSide} />
          </Collapsible>
        </motion.div>

        {/* Inner World & Social */}
        <motion.div {...fadeUp} className="mb-4">
          <Collapsible title="Inner World" icon="🌀">
            <Paragraph text={d.personality.innerWorld} />
          </Collapsible>
        </motion.div>

        <motion.div {...fadeUp} className="mb-4">
          <Collapsible title="Social Style" icon="🫂">
            <Paragraph text={d.personality.socialStyle} />
          </Collapsible>
        </motion.div>

        <motion.div {...fadeUp} className="mb-4">
          <Collapsible title="Emotional Landscape" icon="💧">
            <Paragraph text={d.personality.emotionalLandscape} />
          </Collapsible>
        </motion.div>

        <motion.div {...fadeUp} className="mb-4">
          <Collapsible title="When You're Stressed" icon="⚡">
            <Paragraph text={d.personality.stressResponse} />
          </Collapsible>
        </motion.div>

        <motion.div {...fadeUp} className="mb-4">
          <Collapsible title="Growth Path" icon="🌿">
            <Paragraph text={d.personality.growthPath} />
          </Collapsible>
        </motion.div>

        {/* Strengths */}
        <motion.div {...fadeUp} className="mb-4">
          <Collapsible title="Strengths" icon="✨" defaultOpen>
            <div className="flex flex-wrap gap-2 mb-3">
              {d.strengths.list.map((s) => (
                <Pill key={s} className="border-emerald-500/20 bg-emerald-500/8 text-emerald-400">
                  {s}
                </Pill>
              ))}
            </div>
            <Paragraph text={d.strengths.details} />
          </Collapsible>
        </motion.div>

        {/* ── FREE TIER GATE ── */}
        {!isPremium && (
          <motion.div {...fadeUp} className="mb-4 space-y-4">
            {/* Blurred teaser of locked sections */}
            <div className="relative overflow-hidden rounded-2xl">
              <div className="pointer-events-none select-none blur-sm opacity-50 space-y-3 px-1">
                <div className="rounded-2xl border border-border bg-surface-glass/40 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-txt-muted">🌱 Areas to Grow</p>
                  <p className="mt-2 text-sm text-txt-dim">Discover the growth edges that make you stronger…</p>
                </div>
                <div className="rounded-2xl border border-border bg-surface-glass/40 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-txt-muted">💕 In Love</p>
                  <p className="mt-2 text-sm text-txt-dim">Understand your unique love language and attachment style…</p>
                </div>
                <div className="rounded-2xl border border-border bg-surface-glass/40 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-txt-muted">💼 Career</p>
                  <p className="mt-2 text-sm text-txt-dim">Unlock your ideal roles and leadership style…</p>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent via-surface/60 to-surface/90">
                <div className="text-center px-6">
                  <p className="text-sm font-semibold text-txt mb-1">20+ more sections await</p>
                  <p className="text-xs text-txt-muted">Love, Career, Health, Spirituality, Mythology & more</p>
                </div>
              </div>
            </div>
            <UpgradeBanner />
          </motion.div>
        )}

        {/* ── PRO-ONLY SECTIONS ── */}
        {isPremium && (<>
        <motion.div {...fadeUp} className="mb-4">
          <Collapsible title="Areas to Grow" icon="🌱">
            <div className="flex flex-wrap gap-2 mb-3">
              {d.weaknesses.list.map((w) => (
                <Pill key={w} className="border-amber-500/20 bg-amber-500/8 text-amber-400">
                  {w}
                </Pill>
              ))}
            </div>
            <Paragraph text={d.weaknesses.details} />
          </Collapsible>
        </motion.div>

        {/* Love */}
        <motion.div {...fadeUp} className="mb-4">
          <Collapsible title="In Love" icon="💕" defaultOpen>
            <div className="space-y-4">
              <div>
                <SubHeading>Love Style</SubHeading>
                <Paragraph text={d.love.style} />
              </div>
              <div>
                <SubHeading>What Attracts You</SubHeading>
                <Paragraph text={d.love.attractedTo} />
              </div>
              <div>
                <SubHeading>In a Relationship</SubHeading>
                <Paragraph text={d.love.inRelationship} />
              </div>
              <div>
                <SubHeading>Dealbreakers</SubHeading>
                <Paragraph text={d.love.dealbreakers} />
              </div>
              <div>
                <SubHeading>Attachment Style</SubHeading>
                <Paragraph text={d.love.attachmentStyle} />
              </div>
              <div>
                <SubHeading>Tips for Loving You</SubHeading>
                <ul className="space-y-1 pl-4 text-sm text-txt-secondary list-disc">
                  {d.love.loveTips.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap gap-4 pt-2">
                <div>
                  <span className="mb-1 block text-xs font-semibold text-emerald-400">Best Matches</span>
                  <div className="flex flex-wrap gap-1">
                    {d.love.bestMatches.map((m) => (
                      <Pill key={m} className="border-emerald-500/20 bg-emerald-500/8 text-emerald-400">
                        {ZODIAC_EMOJIS[m] ?? ""} {m}
                      </Pill>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="mb-1 block text-xs font-semibold text-amber-400">Challenging Matches</span>
                  <div className="flex flex-wrap gap-1">
                    {d.love.challengingMatches.map((m) => (
                      <Pill key={m} className="border-amber-500/20 bg-amber-500/8 text-amber-400">
                        {ZODIAC_EMOJIS[m] ?? ""} {m}
                      </Pill>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Collapsible>
        </motion.div>

        {/* Friendship */}
        <motion.div {...fadeUp} className="mb-4">
          <Collapsible title="Friendship" icon="🤝">
            <div className="space-y-4">
              <Paragraph text={d.friendship.style} />
              <div>
                <SubHeading>As a Friend</SubHeading>
                <Paragraph text={d.friendship.asAFriend} />
              </div>
              <div>
                <SubHeading>What You Need in Friendships</SubHeading>
                <Paragraph text={d.friendship.needsInFriendship} />
              </div>
              <div>
                <SubHeading>Tips</SubHeading>
                <ul className="space-y-1 pl-4 text-sm text-txt-secondary list-disc">
                  {d.friendship.friendshipTips.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Collapsible>
        </motion.div>

        {/* Family */}
        <motion.div {...fadeUp} className="mb-4">
          <Collapsible title="Family" icon="🏡">
            <div className="space-y-4">
              <div>
                <SubHeading>As a Child</SubHeading>
                <Paragraph text={d.family.asChild} />
              </div>
              <div>
                <SubHeading>As a Parent</SubHeading>
                <Paragraph text={d.family.asParent} />
              </div>
              <div>
                <SubHeading>Family Dynamics</SubHeading>
                <Paragraph text={d.family.familyDynamics} />
              </div>
            </div>
          </Collapsible>
        </motion.div>

        {/* Career */}
        <motion.div {...fadeUp} className="mb-4">
          <Collapsible title="Career" icon="💼">
            <div className="space-y-4">
              <Paragraph text={d.career.style} />
              <div>
                <SubHeading>Ideal Roles</SubHeading>
                <div className="flex flex-wrap gap-2">
                  {d.career.idealRoles.map((r) => (
                    <Pill key={r} className="border-cyan-500/20 bg-cyan-500/8 text-cyan-400">{r}</Pill>
                  ))}
                </div>
              </div>
              <div>
                <SubHeading>Work Environment</SubHeading>
                <Paragraph text={d.career.workEnvironment} />
              </div>
              <div>
                <SubHeading>Leadership Style</SubHeading>
                <Paragraph text={d.career.leadershipStyle} />
              </div>
              <div>
                <SubHeading>As a Colleague</SubHeading>
                <Paragraph text={d.career.asColleague} />
              </div>
              <div>
                <SubHeading>Money Style</SubHeading>
                <Paragraph text={d.career.moneyStyle} />
              </div>
              <div>
                <SubHeading>Career Tips</SubHeading>
                <ul className="space-y-1 pl-4 text-sm text-txt-secondary list-disc">
                  {d.career.careerTips.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Collapsible>
        </motion.div>

        {/* Communication */}
        <motion.div {...fadeUp} className="mb-4">
          <Collapsible title="Communication" icon="🗣️">
            <div className="space-y-4">
              <Paragraph text={d.communication.style} />
              <div>
                <SubHeading>In Arguments</SubHeading>
                <Paragraph text={d.communication.argumentStyle} />
              </div>
              <div>
                <SubHeading>Listening Style</SubHeading>
                <Paragraph text={d.communication.listeningStyle} />
              </div>
              <div>
                <SubHeading>Tips</SubHeading>
                <ul className="space-y-1 pl-4 text-sm text-txt-secondary list-disc">
                  {d.communication.tips.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Collapsible>
        </motion.div>

        {/* Health */}
        <motion.div {...fadeUp} className="mb-4">
          <Collapsible title="Health & Wellness" icon="🧘">
            <div className="space-y-4">
              <div>
                <SubHeading>Constitution</SubHeading>
                <Paragraph text={d.health.constitution} />
              </div>
              <div>
                <SubHeading>Vulnerabilities</SubHeading>
                <Paragraph text={d.health.vulnerabilities} />
              </div>
              <div>
                <SubHeading>Exercise Style</SubHeading>
                <Paragraph text={d.health.exerciseStyle} />
              </div>
              <div>
                <SubHeading>Mental Health</SubHeading>
                <Paragraph text={d.health.mentalHealth} />
              </div>
              <div>
                <SubHeading>Wellness Tips</SubHeading>
                <ul className="space-y-1 pl-4 text-sm text-txt-secondary list-disc">
                  {d.health.wellnessTips.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Collapsible>
        </motion.div>

        {/* Spirituality */}
        <motion.div {...fadeUp} className="mb-4">
          <Collapsible title="Spirituality" icon="🔮">
            <div className="space-y-4">
              <Paragraph text={d.spirituality.path} />
              <div>
                <SubHeading>Practices</SubHeading>
                <ul className="space-y-1 pl-4 text-sm text-txt-secondary list-disc">
                  {d.spirituality.practices.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
              <div>
                <SubHeading>Life Lesson</SubHeading>
                <Paragraph text={d.spirituality.lessonInLife} />
              </div>
            </div>
          </Collapsible>
        </motion.div>

        {/* Mythology */}
        <motion.div {...fadeUp} className="mb-4">
          <Collapsible title="Mythology & Symbolism" icon="📜">
            <div className="space-y-4">
              <div>
                <SubHeading>Origin Myth</SubHeading>
                <Paragraph text={d.mythology.origin} />
              </div>
              <div>
                <SubHeading>Ancient Associations</SubHeading>
                <Paragraph text={d.mythology.ancientAssociations} />
              </div>
              <div>
                <SubHeading>Symbolism</SubHeading>
                <Paragraph text={d.mythology.symbolism} />
              </div>
            </div>
          </Collapsible>
        </motion.div>

        {/* Decans */}
        <motion.div {...fadeUp} className="mb-4">
          <Collapsible title="The Three Decans" icon="🔢">
            <div className="space-y-4">
              {[d.decans.first, d.decans.second, d.decans.third].map((dec, i) => (
                <div key={i}>
                  <SubHeading>
                    {i === 0 ? "1st" : i === 1 ? "2nd" : "3rd"} Decan · {dec.dateRange} · {dec.subRuler}
                  </SubHeading>
                  <Paragraph text={dec.traits} />
                </div>
              ))}
            </div>
          </Collapsible>
        </motion.div>

        {/* Celebrities */}
        <motion.div {...fadeUp} className="mb-4">
          <Collapsible title="Famous Figures" icon="⭐">
            <div className="flex flex-wrap gap-2">
              {d.celebrities.map((c) => (
                <Pill key={c} className="border-purple-500/20 bg-purple-500/8 text-purple-400">{c}</Pill>
              ))}
            </div>
          </Collapsible>
        </motion.div>

        {/* Fun Facts */}
        <motion.div {...fadeUp} className="mb-4">
          <Collapsible title="Fun Facts" icon="🎲">
            <ul className="space-y-2 pl-4 text-sm text-txt-secondary list-disc">
              {d.funFacts.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </Collapsible>
        </motion.div>

        {/* Hidden Depths, Shadow Work, Sacred Gifts */}
        <motion.div {...fadeUp} className="mb-4">
          <Collapsible title="Hidden Depths" icon="🌊">
            <Paragraph text={d.hiddenDepths} />
          </Collapsible>
        </motion.div>

        <motion.div {...fadeUp} className="mb-4">
          <Collapsible title="Evolutionary Journey" icon="🦋">
            <Paragraph text={d.evolutionaryJourney} />
          </Collapsible>
        </motion.div>

        <motion.div {...fadeUp} className="mb-4">
          <Collapsible title="Shadow Work" icon="🪞">
            <Paragraph text={d.shadowWork} />
          </Collapsible>
        </motion.div>

        <motion.div {...fadeUp} className="mb-4">
          <Collapsible title="Sacred Gifts" icon="🎁">
            <Paragraph text={d.sacredGifts} />
          </Collapsible>
        </motion.div>

        {/* Quick Reference */}
        <motion.div {...fadeUp} className="mb-4">
          <Collapsible title="Quick Reference" icon="📋">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-xs font-semibold text-txt-dim">Symbol</span>
                <p className="text-txt-secondary">{d.symbol}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-txt-dim">Season</span>
                <p className="text-txt-secondary">{d.season}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-txt-dim">Lucky Day</span>
                <p className="text-txt-secondary">{d.luckyDay}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-txt-dim">Lucky Numbers</span>
                <p className="text-txt-secondary">{d.luckyNumbers.join(", ")}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-txt-dim">Colors</span>
                <p className="text-txt-secondary">{d.colors.join(", ")}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-txt-dim">Gemstones</span>
                <p className="text-txt-secondary">{d.gemstones.join(", ")}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-txt-dim">Flowers</span>
                <p className="text-txt-secondary">{d.flowers.join(", ")}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-txt-dim">Body Parts</span>
                <p className="text-txt-secondary">{d.bodyParts.join(", ")}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-txt-dim">Polarity</span>
                <p className="text-txt-secondary">{d.polarity}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-txt-dim">House</span>
                <p className="text-txt-secondary">{d.houseNumber} — {d.houseName}</p>
              </div>
            </div>
          </Collapsible>
        </motion.div>
        </>)}

        {/* Daily Quotes */}
        <motion.div {...fadeUp} className="mb-8">
          <GlassCard className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent-bright mb-2">
              Daily Inspiration
            </p>
            <p className="text-sm italic leading-relaxed text-txt-secondary">
              &ldquo;{d.dailyQuotes[Math.floor(Math.random() * d.dailyQuotes.length)]}&rdquo;
            </p>
          </GlassCard>
        </motion.div>
      </motion.div>
    </AppShell>
  );
}
