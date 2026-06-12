"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApiError } from "@/lib/api/client";
import { register } from "@/lib/api/auth";
import { AuthGate } from "@/components/auth/auth-gate";
import { AppCard } from "@/components/ui/app-primitives";
import { cn } from "@/lib/utils/cn";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await register(name.trim(), email.trim(), password);
      router.replace("/login");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Impossible de créer le compte.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthGate mode="guest">
      <main className="min-h-screen bg-gradient-to-b from-rdv-bg to-rdv-surface px-4 py-8">
        <div className="mx-auto w-full max-w-md">
          <AppCard className="p-5">
            <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-rdv-primary" />
            <h1 className="text-center text-xl font-bold">Créer un compte</h1>
            <p className="mt-2 text-center text-sm text-rdv-muted">
              Rejoins RDV et commence à découvrir des profils près de chez toi.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <input
                required
                minLength={2}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Prénom"
                className="w-full rounded-[18px] border border-rdv-divider bg-rdv-surface px-4 py-3 outline-none focus:border-rdv-primary"
              />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Adresse e-mail"
                className="w-full rounded-[18px] border border-rdv-divider bg-rdv-surface px-4 py-3 outline-none focus:border-rdv-primary"
              />
              <input
                required
                minLength={8}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe (8+ caractères)"
                className="w-full rounded-[18px] border border-rdv-divider bg-rdv-surface px-4 py-3 outline-none focus:border-rdv-primary"
              />

              {error ? (
                <p className="rounded-xl bg-rdv-nope/10 px-3 py-2 text-sm text-rdv-nope">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full rounded-[12px] bg-rdv-primary py-3.5 text-lg font-bold text-white",
                  isSubmitting && "opacity-60",
                )}
              >
                {isSubmitting ? "Création…" : "S'inscrire"}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-rdv-muted">
              Déjà membre ?{" "}
              <Link href="/login" className="font-bold text-rdv-primary">
                Se connecter
              </Link>
            </p>
          </AppCard>
        </div>
      </main>
    </AuthGate>
  );
}
