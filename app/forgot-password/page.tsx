"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GlowButton } from "@/components/ui";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

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
          <span className="mb-4 inline-block text-5xl">🔑</span>
          <h1 className="text-2xl font-bold text-txt">Reset Password</h1>
          <p className="mt-1 text-sm text-txt-secondary">
            Enter your email and we&apos;ll send a reset link
          </p>
        </motion.div>

        {sent ? (
          <motion.div {...fadeUp} className="text-center">
            <div className="mb-4 rounded-2xl border border-green-500/20 bg-green-500/8 px-4 py-4 text-sm text-green-400">
              If an account exists with that email, you&apos;ll receive a password reset link shortly.
            </div>
            <Link href="/login" className="text-sm text-accent-bright hover:underline">
              Back to Sign In
            </Link>
          </motion.div>
        ) : (
          <>
            <motion.form {...fadeUp} onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="label">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <GlowButton type="submit" className="w-full" loading={loading}>
                Send Reset Link
              </GlowButton>
            </motion.form>

            <motion.p {...fadeUp} className="mt-6 text-center text-sm text-txt-muted">
              Remember your password?{" "}
              <Link href="/login" className="font-medium text-accent-bright hover:underline">
                Sign in
              </Link>
            </motion.p>
          </>
        )}
      </motion.div>
    </main>
  );
}
