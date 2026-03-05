"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { GlowButton } from "@/components/ui";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

function ResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || "Reset failed");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-sm text-red-400">Invalid or missing reset token.</p>
        <Link href="/forgot-password" className="mt-4 inline-block text-sm text-accent-bright hover:underline">
          Request a new reset link
        </Link>
      </div>
    );
  }

  return success ? (
    <motion.div {...fadeUp} className="text-center">
      <div className="mb-4 rounded-2xl border border-green-500/20 bg-green-500/8 px-4 py-4 text-sm text-green-400">
        Password reset successfully!
      </div>
      <Link href="/login" className="text-sm text-accent-bright hover:underline">
        Sign in with your new password
      </Link>
    </motion.div>
  ) : (
    <motion.form {...fadeUp} onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="password" className="label">New Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          placeholder="Min 6 characters"
          minLength={6}
          required
        />
      </div>

      <div>
        <label htmlFor="confirm" className="label">Confirm Password</label>
        <input
          id="confirm"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input"
          placeholder="Repeat password"
          required
        />
      </div>

      <GlowButton type="submit" className="w-full" loading={loading}>
        Reset Password
      </GlowButton>
    </motion.form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-4">
      <div className="pointer-events-none absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-accent/6 blur-[100px]" />

      <motion.div
        initial="initial"
        animate="animate"
        transition={{ staggerChildren: 0.08 }}
        className="relative z-10 w-full max-w-sm"
      >
        <motion.div {...fadeUp} className="mb-8 text-center">
          <span className="mb-4 inline-block text-5xl">🔐</span>
          <h1 className="text-2xl font-bold text-txt">New Password</h1>
          <p className="mt-1 text-sm text-txt-secondary">
            Choose a strong password for your account
          </p>
        </motion.div>

        <Suspense fallback={<div className="text-center text-txt-muted text-sm">Loading...</div>}>
          <ResetForm />
        </Suspense>
      </motion.div>
    </main>
  );
}
