"use client";

import { useState } from "react";
import { ApiError } from "@/lib/api/client";
import { adminBootstrap } from "@/lib/api/admin";
import { AdminButton, AdminInput } from "@/components/admin/admin-ui";
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
    <div className="mt-6 border-t border-rdv-divider pt-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left text-sm font-semibold text-rdv-muted hover:text-rdv-text"
      >
        {open ? "▼" : "▶"} Première promotion admin (sans SQL)
      </button>

      {open ? (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <p className="text-xs leading-relaxed text-rdv-muted">
            Le compte doit déjà exister avec un mot de passe. Sur Render, définis{" "}
            <code className="rounded bg-rdv-message px-1 text-rdv-text">
              ADMIN_BOOTSTRAP_SECRET
            </code>{" "}
            puis redéploie le backend.
          </p>
          <AdminInput
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail du compte à promouvoir"
          />
          <AdminInput
            type="password"
            required
            minLength={8}
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Secret bootstrap (ADMIN_BOOTSTRAP_SECRET)"
          />
          {message ? (
            <p className="rounded-[var(--rdv-radius-input)] border border-rdv-like/30 bg-rdv-like-surface px-3 py-2 text-sm text-rdv-like">
              {message}
            </p>
          ) : null}
          {error ? (
            <p className="rounded-[var(--rdv-radius-input)] border border-rdv-nope/30 bg-rdv-nope-surface px-3 py-2 text-sm text-rdv-nope">
              {error}
            </p>
          ) : null}
          <AdminButton
            type="submit"
            variant="secondary"
            disabled={isSubmitting}
            className={cn("w-full", isSubmitting && "opacity-50")}
          >
            {isSubmitting ? "Promotion…" : "Promouvoir en SUPER_ADMIN"}
          </AdminButton>
        </form>
      ) : null}
    </div>
  );
}
