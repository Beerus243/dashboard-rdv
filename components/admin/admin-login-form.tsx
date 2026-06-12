"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, Shield } from "lucide-react";
import { ApiError } from "@/lib/api/client";
import { useAdminAuth } from "@/components/providers/admin-auth-provider";
import { cn } from "@/lib/utils/cn";
import { AdminBootstrapPanel } from "@/components/admin/admin-bootstrap-panel";

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
          ? err.message === "Invalid admin credentials"
            ? "Identifiants admin invalides ou compte sans rôle admin."
            : err.message
          : "Connexion admin impossible pour le moment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rdv-primary/15 ring-1 ring-rdv-primary/30">
          <Shield className="h-8 w-8 text-rdv-primary" />
        </div>
        <h1 className="text-2xl font-extrabold text-white">
          Console administration
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Accès réservé aux comptes avec rôle{" "}
          {Object.keys(ADMIN_ROLE_LABELS).slice(0, 2).join(", ")}…
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-200">
              E-mail administrateur
            </span>
            <span className="relative flex items-center">
              <Mail className="pointer-events-none absolute left-3 h-5 w-5 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@rdv.app"
                autoComplete="username"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-white outline-none focus:border-rdv-primary focus:ring-1 focus:ring-rdv-primary"
              />
            </span>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-200">
              Mot de passe
            </span>
            <span className="relative flex items-center">
              <Lock className="pointer-events-none absolute left-3 h-5 w-5 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-12 text-white outline-none focus:border-rdv-primary focus:ring-1 focus:ring-rdv-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 text-slate-400 hover:text-white"
                aria-label={
                  showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"
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
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={!canSubmit}
            className={cn(
              "flex w-full items-center justify-center rounded-xl bg-rdv-primary py-3.5 text-base font-bold text-white transition hover:bg-rdv-primary/90",
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

        <p className="mt-6 text-center text-xs text-slate-500">
          Compte déjà admin ? Connecte-toi ci-dessus.
        </p>
        <AdminBootstrapPanel />
        <p className="mt-3 text-center text-sm">
          <Link href="/login" className="font-semibold text-slate-400 hover:text-white">
            ← Retour à l&apos;app utilisateur
          </Link>
        </p>
      </div>
    </div>
  );
}
