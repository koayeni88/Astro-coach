"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { FullPageLoader } from "./ui";
import { AppNavigation } from "./navbar";

/* ------------------------------------------------------------------ */
/*  PROFILE CONTEXT                                                    */
/* ------------------------------------------------------------------ */
interface ProfileData {
  sign: string;
  focusArea: string;
  mood: string;
  struggle: string;
  birthDate: string;
  birthTime?: string | null;
  birthPlace?: string | null;
  moonSign?: string | null;
  risingSign?: string | null;
}

interface SubscriptionData {
  tier: "FREE" | "PREMIUM";
  aiMessagesLimit: number;
  aiMessagesUsedToday: number;
}

interface ProfileContextType {
  profile: ProfileData | null;
  subscription: SubscriptionData | null;
  isPremium: boolean;
  refreshProfile: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  subscription: null,
  isPremium: false,
  refreshProfile: async () => {},
  refreshSubscription: async () => {},
});

export function useProfile() {
  return useContext(ProfileContext);
}

/* ------------------------------------------------------------------ */
/*  AUTH SHELL — wraps all authenticated routes                        */
/* ------------------------------------------------------------------ */
export function AuthShell({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.status === 404) {
        setRedirecting(true);
        router.push("/onboarding");
        return;
      }
      if (res.ok) {
        setProfile(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const fetchSubscription = useCallback(async () => {
    try {
      const res = await fetch("/api/subscription");
      if (res.ok) {
        setSubscription(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetchProfile();
      fetchSubscription();
    }
  }, [status, fetchProfile, fetchSubscription, router]);

  const refreshProfile = useCallback(async () => {
    const res = await fetch("/api/profile");
    if (res.ok) setProfile(await res.json());
  }, []);

  const refreshSubscription = useCallback(async () => {
    const res = await fetch("/api/subscription");
    if (res.ok) setSubscription(await res.json());
  }, []);

  const isPremium = subscription?.tier === "PREMIUM";

  // Show loader while checking auth, loading profile, or redirecting
  if (status === "loading" || loading || redirecting) {
    return <FullPageLoader />;
  }

  // Safety: if profile is null (shouldn't happen if not redirecting), show loader
  if (!profile) {
    return <FullPageLoader />;
  }

  return (
    <ProfileContext.Provider value={{ profile, subscription, isPremium, refreshProfile, refreshSubscription }}>
      <AppNavigation />
      <div className="md:pl-60">{children}</div>
    </ProfileContext.Provider>
  );
}
