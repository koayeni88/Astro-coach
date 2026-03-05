"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState, useCallback, createContext, useContext } from "react";

/* ------------------------------------------------------------------ */
/*  CONSTANTS                                                          */
/* ------------------------------------------------------------------ */
export const ZODIAC_EMOJIS: Record<string, string> = {
  Aries: "♈", Taurus: "♉", Gemini: "♊", Cancer: "♋",
  Leo: "♌", Virgo: "♍", Libra: "♎", Scorpio: "♏",
  Sagittarius: "♐", Capricorn: "♑", Aquarius: "♒", Pisces: "♓",
};

export const ZODIAC_ELEMENTS: Record<string, string> = {
  Aries: "Fire", Taurus: "Earth", Gemini: "Air", Cancer: "Water",
  Leo: "Fire", Virgo: "Earth", Libra: "Air", Scorpio: "Water",
  Sagittarius: "Fire", Capricorn: "Earth", Aquarius: "Air", Pisces: "Water",
};

export const ELEMENT_COLORS: Record<string, string> = {
  Fire: "text-orange-400",
  Earth: "text-emerald-400",
  Air: "text-sky-400",
  Water: "text-blue-400",
};

/* ------------------------------------------------------------------ */
/*  ANIMATION VARIANTS                                                 */
/* ------------------------------------------------------------------ */
export const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06 } },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3 },
};

/* ------------------------------------------------------------------ */
/*  TOAST SYSTEM                                                       */
/* ------------------------------------------------------------------ */
type ToastType = "success" | "error" | "info";
interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

const ToastContext = createContext<{
  toast: (message: string, type?: ToastType) => void;
}>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const colors: Record<ToastType, string> = {
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    error: "border-red-500/30 bg-red-500/10 text-red-300",
    info: "border-accent/30 bg-accent/10 text-accent-bright",
  };
  const icons: Record<ToastType, string> = { success: "✓", error: "✕", info: "ℹ" };

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      {/* toast container */}
      <div role="status" aria-live="polite" className="pointer-events-none fixed bottom-20 left-0 right-0 z-[100] flex flex-col items-center gap-2 px-4 md:bottom-6">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className={`pointer-events-auto flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium backdrop-blur-xl shadow-glass ${colors[t.type]}`}
            >
              <span className="text-xs">{icons[t.type]}</span>
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  APP SHELL — wraps every authenticated page                         */
/* ------------------------------------------------------------------ */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-2xl px-4 pb-28 pt-[4.5rem] md:max-w-3xl md:pb-8 md:pt-8"
    >
      {children}
    </motion.main>
  );
}

/* ------------------------------------------------------------------ */
/*  GLASS CARD                                                         */
/* ------------------------------------------------------------------ */
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  as?: "div" | "button";
}
export function GlassCard({
  children,
  className = "",
  hover = false,
  onClick,
  as = "div",
}: GlassCardProps) {
  const base =
    "glass-card" +
    (hover ? " hover:border-border-accent hover:shadow-glow-sm cursor-pointer" : "");
  const Comp = as === "button" ? motion.button : motion.div;
  return (
    <Comp
      whileHover={hover ? { y: -2 } : undefined}
      whileTap={hover ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`${base} ${className}`}
    >
      {children}
    </Comp>
  );
}

/* ------------------------------------------------------------------ */
/*  GLOW BUTTON                                                        */
/* ------------------------------------------------------------------ */
interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "gold" | "secondary";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  full?: boolean;
  children: React.ReactNode;
}
export function GlowButton({
  variant = "primary",
  size = "md",
  loading,
  full,
  children,
  className = "",
  disabled,
  ...props
}: GlowButtonProps) {
  const variants: Record<string, string> = {
    primary: "btn-glow",
    ghost: "btn-ghost",
    gold: "btn-glow !bg-amber-600 !shadow-glow-gold hover:!bg-amber-500",
    secondary: "btn-ghost",
  };
  const sizes: Record<string, string> = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-3.5 text-base",
  };
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`${variants[variant] || variants.primary} ${sizes[size]} ${full ? "w-full" : ""} ${className}`}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <LoadingSpinner size="sm" />
          <span>One moment…</span>
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/*  SECTION HEADER                                                     */
/* ------------------------------------------------------------------ */
export function SectionHeader({
  title,
  subtitle,
  icon,
  trailing,
}: {
  title: string;
  subtitle?: string;
  icon?: string;
  trailing?: React.ReactNode;
}) {
  return (
    <motion.div {...fadeUp} className="mb-5 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-txt">
          {icon && <span className="text-xl">{icon}</span>}
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-txt-secondary">{subtitle}</p>
        )}
      </div>
      {trailing && <div className="shrink-0">{trailing}</div>}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  STAT PILL                                                          */
/* ------------------------------------------------------------------ */
export function StatPill({
  icon,
  label,
  className = "",
}: {
  icon?: string;
  label: string;
  className?: string;
}) {
  return (
    <span className={`stat-pill ${className}`}>
      {icon && <span>{icon}</span>}
      {label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  SKELETON LOADERS                                                   */
/* ------------------------------------------------------------------ */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="glass-card space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  );
}

export function SkeletonPage() {
  return (
    <div className="min-h-[60vh] space-y-4 animate-fade-in">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-32" />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  LOADING SPINNER                                                    */
/* ------------------------------------------------------------------ */
export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const s = { sm: "h-4 w-4 border", md: "h-6 w-6 border-2", lg: "h-10 w-10 border-2" };
  return (
    <div className="flex items-center justify-center" role="status" aria-label="Loading">
      <div className={`${s[size]} animate-spin rounded-full border-accent/30 border-t-accent`} />
    </div>
  );
}

export function FullPageLoader() {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-txt-muted">Preparing your reading…</p>
      </motion.div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  UPGRADE BANNER                                                     */
/* ------------------------------------------------------------------ */
export function UpgradeBanner({ onUpgrade }: { onUpgrade?: () => void }) {
  return (
    <motion.div {...fadeUp} className="glass-card overflow-hidden border-astro-gold/20">
      {/* glow strip */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-astro-gold/60 to-transparent" />
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="flex items-center gap-1.5 font-semibold text-astro-gold">
            <span>✦</span> Go Premium
          </p>
          <p className="mt-0.5 text-xs text-txt-secondary">
            Complete readings, 50 daily messages, and the ability to regenerate
          </p>
        </div>
        {onUpgrade && (
          <GlowButton variant="gold" size="sm" onClick={onUpgrade}>
            Upgrade
          </GlowButton>
        )}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  EMPTY STATE                                                        */
/* ------------------------------------------------------------------ */
export function EmptyState({
  icon = "🌌",
  title,
  description,
  action,
}: {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      {...fadeUp}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <span className="mb-4 text-5xl">{icon}</span>
      <p className="text-lg font-semibold text-txt">{title}</p>
      {description && (
        <p className="mt-1 max-w-xs text-sm text-txt-secondary">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  COLLAPSIBLE SECTION (progressive disclosure)                       */
/* ------------------------------------------------------------------ */
export function Collapsible({
  title,
  icon,
  children,
  defaultOpen = false,
  badge,
}: {
  title: string;
  icon?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = `collapsible-${title.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <GlassCard className="!p-0 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={contentId}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-surface-glass/40 focus-visible:ring-inset"
      >
        {icon && <span className="text-lg">{icon}</span>}
        <span className="flex-1 text-sm font-semibold text-txt">{title}</span>
        {badge}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-txt-muted"
        >
          ▾
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div id={contentId} className="border-t border-border px-5 py-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}

/* ------------------------------------------------------------------ */
/*  GATED BADGE                                                        */
/* ------------------------------------------------------------------ */
export function PremiumBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-astro-gold/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-astro-gold">
      ✦ Pro
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  SHARE DAILY CARD (visual component)                                */
/* ------------------------------------------------------------------ */
export function ShareDailyCard({
  quote,
  sign,
  theme,
  date,
}: {
  quote: string;
  sign: string;
  theme: string;
  date: string;
}) {
  return (
    <div
      id="share-card"
      className="relative overflow-hidden rounded-3xl border border-accent/20 bg-gradient-to-br from-cosmic-950 via-cosmic-900 to-cosmic-950 p-6 shadow-glow"
    >
      {/* decorative orbs */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-astro-teal/10 blur-3xl" />

      <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-txt-muted">
        Your Daily Insight
      </p>
      <p className="text-center text-lg font-semibold leading-relaxed text-txt">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="mt-5 flex items-center justify-center gap-3 text-xs text-txt-muted">
        <span className="text-base">{ZODIAC_EMOJIS[sign]}</span>
        <span className="font-medium text-txt-secondary">{sign}</span>
        <span>·</span>
        <span>{theme}</span>
        <span>·</span>
        <span>{date}</span>
      </div>
      <p className="mt-4 text-center text-[10px] font-medium tracking-widest text-txt-dim">
        ASTRO COACH
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  CONFIRM DIALOG                                                     */
/* ------------------------------------------------------------------ */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby={description ? "confirm-desc" : undefined}
            className="glass-card w-full max-w-sm !p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="confirm-title" className="text-lg font-bold text-txt">{title}</h3>
            {description && (
              <p id="confirm-desc" className="mt-2 text-sm text-txt-secondary">{description}</p>
            )}
            <div className="mt-5 flex gap-3">
              <GlowButton variant="ghost" className="flex-1" onClick={onCancel}>
                {cancelLabel}
              </GlowButton>
              <GlowButton className="flex-1" onClick={onConfirm}>
                {confirmLabel}
              </GlowButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* legacy exports so old imports don't break during migration */
export const PageContainer = AppShell;
export const PageHeader = SectionHeader;
