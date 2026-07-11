"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { RdvLogo } from "@/components/brand/rdv-logo";
import { ApiError } from "@/lib/api/client";
import { useAdminAuth } from "@/components/providers/admin-auth-provider";
import { AdminBootstrapPanel } from "@/components/admin/admin-bootstrap-panel";
import { cn } from "@/lib/utils/cn";

const ADMIN_ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super administrateur",
  ADMIN: "Administrateur",
  MODERATOR: "Modérateur",
  OBSERVER: "Observateur",
};

export function AdminLoginForm() {
  const router = useRouter();
  const { login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit =
    email.trim().length > 0 && password.length >= 8 && !isSubmitting;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      router.replace("/admin");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.statusCode === 401
            ? "E-mail, mot de passe ou rôle admin incorrect."
            : err.message
          : "Connexion admin impossible pour le moment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="admin-root mx-auto w-full max-w-md px-4 py-10">
      <div className="mb-8 flex flex-col items-center text-center">
        <RdvLogo size="xl" priority imageClassName="rounded-[var(--rdv-radius-auth)]" />
        <h1 className="mt-4 text-[22px] font-extrabold text-white dark:text-rdv-text">
          Console administration
        </h1>
        <p className="mt-2 text-sm text-white/80 dark:text-rdv-muted">
          Accès réservé aux comptes avec rôle{" "}
          {Object.keys(ADMIN_ROLE_LABELS).slice(0, 2).join(", ")}…
        </p>
      </div>

      <div className="rounded-[var(--rdv-radius-auth)] border border-rdv-divider bg-rdv-surface p-6 shadow-[var(--rdv-shadow-card)]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-semibold text-rdv-text">
              E-mail administrateur
            </span>
            <span className="relative flex items-center">
              <Mail className="pointer-events-none absolute left-3 h-5 w-5 text-rdv-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@rdv.app"
                autoComplete="username"
                className="w-full rounded-[var(--rdv-radius-input)] border border-rdv-divider bg-rdv-surface py-3 pl-11 pr-4 text-rdv-text outline-none focus:border-rdv-primary focus:ring-[1.5px] focus:ring-rdv-primary/30"
              />
            </span>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[13px] font-semibold text-rdv-text">
              Mot de passe
            </span>
            <span className="relative flex items-center">
              <Lock className="pointer-events-none absolute left-3 h-5 w-5 text-rdv-muted" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full rounded-[var(--rdv-radius-input)] border border-rdv-divider bg-rdv-surface py-3 pl-11 pr-12 text-rdv-text outline-none focus:border-rdv-primary focus:ring-[1.5px] focus:ring-rdv-primary/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 text-rdv-muted hover:text-rdv-text"
                aria-label={
                  showPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </span>
          </label>

          {error ? (
            <p className="rounded-[var(--rdv-radius-input)] border border-rdv-nope/30 bg-rdv-nope-surface px-3 py-2 text-sm text-rdv-nope">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={!canSubmit}
            className={cn(
              "flex w-full items-center justify-center rounded-[var(--rdv-radius-input)] bg-rdv-primary py-3.5 text-base font-bold text-white transition hover:bg-rdv-primary/90",
              !canSubmit && "opacity-50",
            )}
          >
            {isSubmitting ? (
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-rdv-muted">
          Compte déjà admin ? Connecte-toi ci-dessus.
        </p>
        <AdminBootstrapPanel />
        <p className="mt-3 text-center text-sm">
          <Link
            href="/login"
            className="font-semibold text-rdv-primary hover:underline"
          >
            ← Retour à l&apos;app utilisateur
          </Link>
        </p>
      </div>
    </div>
  );
}
