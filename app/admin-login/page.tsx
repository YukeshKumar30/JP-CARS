"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, KeyRound, LoaderCircle, LockKeyhole, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.get("username"),
          password: formData.get("password"),
        }),
      });
      const result = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        setError(result?.error || "Unable to sign in. Please try again.");
        return;
      }

      window.location.assign("/admin");
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-jp-bg dark:bg-jp-black">
      <section className="w-full max-w-sm rounded-lg border border-jp-border dark:border-jp-border-dark bg-white dark:bg-jp-dark p-7 shadow-xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-jp-muted hover:text-jp-text dark:hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to website
        </Link>

        <div className="mt-8 mb-7">
          <Image
            src="/jp-cars-logo.svg"
            alt="JP CARS"
            width={160}
            height={100}
            className="h-14 w-auto rounded-lg bg-white p-1 mb-4 shadow-sm"
          />
          <h1 className="mt-1 text-2xl font-bold text-jp-text dark:text-white">Admin sign in</h1>
          <p className="mt-2 text-sm text-jp-muted">Enter your administrator credentials to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-jp-text dark:text-white">Username</label>
            <div className="flex items-center gap-2 rounded-lg border border-jp-border dark:border-jp-border-dark bg-jp-bg dark:bg-jp-black px-3 focus-within:border-jp-gold">
              <KeyRound className="w-4 h-4 text-jp-muted" />
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                maxLength={256}
                className="h-11 min-w-0 flex-1 bg-transparent text-sm text-jp-text dark:text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-jp-text dark:text-white">Password</label>
            <div className="flex items-center gap-2 rounded-lg border border-jp-border dark:border-jp-border-dark bg-jp-bg dark:bg-jp-black px-3 focus-within:border-jp-gold">
              <LockKeyhole className="w-4 h-4 text-jp-muted flex-shrink-0" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                maxLength={1024}
                className="h-11 min-w-0 flex-1 bg-transparent text-sm text-jp-text dark:text-white outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-jp-muted hover:text-jp-text dark:hover:text-white transition-colors flex-shrink-0"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
              {error}
            </p>
          )}

          <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting && <LoaderCircle className="w-4 h-4 animate-spin" />}
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}