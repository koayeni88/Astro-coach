"use client";

import { useEffect } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { ToastProvider } from "@/components/ui";
import { ErrorBoundary } from "@/components/error-boundary";
import { initAnalytics, identifyUser } from "@/lib/analytics";

function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      identifyUser(session.user.id, {
        email: session.user.email || undefined,
        name: session.user.name || undefined,
      });
    }
  }, [session?.user?.id]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AnalyticsProvider>
        <ToastProvider>
          <ErrorBoundary>{children}</ErrorBoundary>
        </ToastProvider>
      </AnalyticsProvider>
    </SessionProvider>
  );
}
