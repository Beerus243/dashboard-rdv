"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { RdvLogo } from "@/components/brand/rdv-logo";
import { ApiError } from "@/lib/api/client";
import { fetchLoginForm } from "@/lib/api/auth";
import { useAuth } from "@/components/providers/auth-provider";
import { AppCard } from "@/components/ui/app-primitives";
import { cn } from "@/lib/utils/cn";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailLabel, setEmailLabel] = useState("Adresse e-mail");
  const [passwordLabel, setPasswordLabel] = useState("Mot de passe");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchLoginForm()
      .then((schema) => {
        for (const field of schema.fields) {
          if (field.name === "email" && field.label) setEmailLabel(field.label);
          if (field.name === "password" && field.label)
            setPasswordLabel(field.label);
        }
      })
      .catch(() => undefined);
  }, []);

  const canSubmit =
    email.trim().length > 0 &&
    password.length >= 8 &&
    !isSubmitting;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      router.replace("/accueil");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Impossible de se connecter pour le moment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-4 px-4 py-8">
      <AppCard className="overflow-hidden p-6">
        <div className="mb-4 flex items-center gap-3">
          <RdvLogo size="md" priority />
          <span className="text-2xl font-black tracking-tight text-rdv-primary">RDV</span>
        </div>
        <h1 className="text-[22px] font-extrabold text-rdv-text">
          Reconnecte-toi à ce qui compte
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-rdv-muted">
          Une entrée plus claire, un ton plus humain et un parcours pensé pour
          aller vite vers de vraies conversations.
        </p>
      </AppCard>

      <AppCard className="p-5">
        <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-rdv-primary" />
        <h2 className="text-center text-xl font-bold text-rdv-text">Connexion</h2>
        <p className="mt-2 text-center text-sm text-rdv-muted">
          Entre ton adresse e-mail et ton mot de passe pour reprendre ta
          découverte.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-rdv-text">
              {emailLabel}
            </span>
            <span className="relative flex items-center">
              <Mail className="pointer-events-none absolute left-3 h-5 w-5 text-rdv-primary" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@rdv.app"
                className="w-full rounded-[18px] border border-rdv-divider bg-rdv-surface py-3 pl-11 pr-4 text-rdv-text outline-none ring-rdv-primary focus:border-rdv-primary focus:ring-1"
              />
            </span>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-rdv-text">
              {passwordLabel}
            </span>
            <span className="relative flex items-center">
              <Lock className="pointer-events-none absolute left-3 h-5 w-5 text-rdv-primary" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entre ton mot de passe"
                className="w-full rounded-[18px] border border-rdv-divider bg-rdv-surface py-3 pl-11 pr-12 text-rdv-text outline-none ring-rdv-primary focus:border-rdv-primary focus:ring-1"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 text-rdv-primary"
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

          <p className="text-xs text-rdv-muted">
            Utilise au moins 8 caractères pour une reprise plus sûre.
          </p>

          {error ? (
            <p className="rounded-xl bg-rdv-nope/10 px-3 py-2 text-sm font-medium text-rdv-nope">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={!canSubmit}
            className={cn(
              "flex w-full items-center justify-center rounded-[12px] bg-rdv-primary py-3.5 text-lg font-bold text-white transition-opacity",
              !canSubmit && "opacity-50",
            )}
          >
            {isSubmitting ? (
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              "Continuer"
            )}
          </button>

          <div className="text-center">
            <Link href="#" className="text-sm font-semibold text-rdv-primary">
              Mot de passe oublié ?
            </Link>
          </div>

          <div className="flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-rdv-divider" />
            <span className="text-xs font-semibold text-rdv-muted">ou</span>
            <div className="h-px flex-1 bg-rdv-divider" />
          </div>

          <Link
            href="/register"
            className="flex w-full items-center justify-center rounded-[12px] border border-rdv-primary/25 py-3.5 text-base font-extrabold text-rdv-text"
          >
            Créer un compte
          </Link>
        </form>
      </AppCard>
    </div>
  );
}
