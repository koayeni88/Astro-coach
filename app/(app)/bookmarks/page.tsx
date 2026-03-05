"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useProfile } from "@/components/auth-shell";
import {
  AppShell,
  SectionHeader,
  GlassCard,
  SkeletonPage,
  EmptyState,
  ZODIAC_EMOJIS,
  fadeUp,
  staggerContainer,
  useToast,
} from "@/components/ui";

interface Bookmark {
  id: string;
  type: string;
  content: string;
  metadata: string | null;
  createdAt: string;
}

export default function BookmarksPage() {
  const { profile } = useProfile();
  const { toast } = useToast();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, []);

  async function loadBookmarks() {
    try {
      const res = await fetch("/api/bookmarks");
      if (res.ok) {
        const data = await res.json();
        setBookmarks(data.bookmarks);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function removeBookmark(id: string) {
    try {
      const res = await fetch(`/api/bookmarks?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setBookmarks((prev) => prev.filter((b) => b.id !== id));
        toast("Bookmark removed");
      }
    } catch (e) {
      console.error(e);
    }
  }

  if (loading) {
    return (
      <AppShell>
        <SkeletonPage />
      </AppShell>
    );
  }

  const typeIcons: Record<string, string> = {
    daily: "🌙",
    weekly: "📅",
    monthly: "🗓️",
    chat: "💬",
    tarot: "🃏",
    affirmation: "✨",
  };

  const typeLabels: Record<string, string> = {
    daily: "Daily Reading",
    weekly: "Weekly Reading",
    monthly: "Monthly Reading",
    chat: "Chat Message",
    tarot: "Tarot Card",
    affirmation: "Affirmation",
  };

  return (
    <AppShell>
      <motion.div variants={staggerContainer} initial="initial" animate="animate">
        <SectionHeader
          title="Bookmarks"
          subtitle={`${bookmarks.length} saved cosmic moments`}
          icon="🔖"
        />

        {bookmarks.length === 0 ? (
          <EmptyState
            icon="🔖"
            title="No bookmarks yet"
            description="Save your favorite readings, messages, and insights"
          />
        ) : (
          <motion.div {...fadeUp} className="space-y-3">
            {bookmarks.map((bookmark) => (
              <GlassCard key={bookmark.id}>
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{typeIcons[bookmark.type] || "⭐"}</span>
                    <div>
                      <p className="text-xs font-semibold text-txt">
                        {typeLabels[bookmark.type] || bookmark.type}
                      </p>
                      <p className="text-[10px] text-txt-muted">
                        {new Date(bookmark.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeBookmark(bookmark.id)}
                    className="text-xs text-txt-muted hover:text-red-400 transition-colors"
                  >
                    Remove
                  </button>
                </div>
                <p className="text-sm leading-relaxed text-txt line-clamp-4">
                  {bookmark.content}
                </p>
              </GlassCard>
            ))}
          </motion.div>
        )}
      </motion.div>
    </AppShell>
  );
}
