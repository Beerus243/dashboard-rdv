"use client";

import { useState } from "react";
import { ApiError } from "@/lib/api/client";
import { adminBootstrap } from "@/lib/api/admin";
import { cn } from "@/lib/utils/cn";

export function AdminBootstrapPanel() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [secret, setSecret] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);
    try {
      const result = await adminBootstrap(email.trim(), secret);
      setMessage(result.message);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Promotion impossible pour le moment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-6 border-t border-slate-800 pt-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left text-sm font-semibold text-slate-400 hover:text-white"
      >
        {open ? "▼" : "▶"} Première promotion admin (sans SQL)
      </button>

      {open ? (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <p className="text-xs leading-relaxed text-slate-500">
            Le compte doit déjà exister avec un mot de passe. Sur Render, définis{" "}
            <code className="rounded bg-slate-800 px-1">ADMIN_BOOTSTRAP_SECRET</code>{" "}
            puis redéploie le backend.
          </p>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail du compte à promouvoir"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-rdv-primary"
          />
          <input
            type="password"
            required
            minLength={8}
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Secret bootstrap (ADMIN_BOOTSTRAP_SECRET)"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-rdv-primary"
          />
          {message ? (
            <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
              {message}
            </p>
          ) : null}
          {error ? (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "w-full rounded-xl border border-slate-600 py-2.5 text-sm font-bold text-slate-200 hover:bg-slate-800",
              isSubmitting && "opacity-50",
            )}
          >
            {isSubmitting ? "Promotion…" : "Promouvoir en SUPER_ADMIN"}
          </button>
        </form>
      ) : null}
    </div>
  );
}
