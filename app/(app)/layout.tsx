"use client";

import { AuthShell } from "@/components/auth-shell";
import { ErrorBoundary } from "@/components/error-boundary";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <AuthShell>{children}</AuthShell>
    </ErrorBoundary>
  );
}
