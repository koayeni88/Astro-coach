"use client";

import posthog from "posthog-js";

let initialized = false;

export function initAnalytics() {
  if (initialized || typeof window === "undefined") return;
  
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;
  
  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") posthog.debug();
    },
    capture_pageview: true,
    capture_pageleave: true,
  });
  
  initialized = true;
}

export function trackEvent(event: string, properties?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    posthog.capture(event, properties);
  } catch {
    // Analytics should never break the app
  }
}

export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    posthog.identify(userId, traits);
  } catch {}
}

// Common events
export const events = {
  SIGNUP: "user_signup",
  LOGIN: "user_login",
  ONBOARDING_COMPLETE: "onboarding_complete",
  DAILY_READING_VIEW: "daily_reading_view",
  DAILY_READING_REGENERATE: "daily_reading_regenerate",
  CHAT_MESSAGE_SENT: "chat_message_sent",
  COMPATIBILITY_CHECK: "compatibility_check",
  SIGN_PROFILE_VIEW: "sign_profile_view",
  UPGRADE_CLICK: "upgrade_click",
  UPGRADE_COMPLETE: "upgrade_complete",
  BOOKMARK_SAVE: "bookmark_save",
  JOURNAL_ENTRY: "journal_entry",
  MOOD_LOG: "mood_log",
  SHARE_READING: "share_reading",
  TAROT_PULL: "tarot_pull",
  STREAK_MILESTONE: "streak_milestone",
} as const;
