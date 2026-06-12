"use client";

import Image from "next/image";
import { LogOut, Moon, Settings, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchProfile } from "@/lib/api/profile";
import { resolveImageUrl } from "@/lib/api/config";
import type { UserProfile } from "@/lib/types";
import { useAuth } from "@/components/providers/auth-provider";
import { useTheme } from "@/components/providers/theme-provider";
import {
  AppCard,
  AppScreenAppBar,
  LoadingState,
} from "@/components/ui/app-primitives";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchProfile();
        setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    void load();
  }, []);

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  const displayName = user?.name ?? "Profil à compléter";
  const avatar =
    profile?.avatarUrl ??
    user?.avatarUrl ??
    profile?.photos?.find((p) => p.isPrimary)?.url ??
    profile?.photos?.[0]?.url;

  return (
    <>
      <AppScreenAppBar
        title="Profil"
        actions={
          <button type="button" className="rounded-full p-2 hover:bg-white/10">
            <Settings className="h-5 w-5" />
          </button>
        }
      />

      {isLoading ? <LoadingState /> : null}

      {!isLoading ? (
        <div className="space-y-4 px-4 py-4">
          <AppCard className="overflow-hidden">
            <div className="relative h-52 bg-gradient-to-br from-rdv-primary/30 to-rdv-secondary/20">
              {avatar ? (
                <Image
                  src={resolveImageUrl(avatar)}
                  alt={displayName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <h2 className="text-2xl font-extrabold">{displayName}</h2>
                <p className="text-sm text-white/85">{user?.email}</p>
              </div>
            </div>
            <div className="p-4">
              <div className="mb-3 h-2 overflow-hidden rounded-full bg-rdv-divider">
                <div
                  className="h-full rounded-full bg-rdv-primary transition-all"
                  style={{
                    width: profile?.isComplete ? "100%" : "45%",
                  }}
                />
              </div>
              <p className="text-sm text-rdv-muted">
                {profile?.bio?.trim() ||
                  "Complète ton profil pour te présenter aux autres membres."}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                {profile?.city ? (
                  <span className="rounded-full bg-[#FFF1F5] px-3 py-1 text-rdv-primary dark:bg-rdv-primary/15">
                    {profile.city}
                  </span>
                ) : null}
                {profile?.job ? (
                  <span className="rounded-full bg-[#FFF1F5] px-3 py-1 text-rdv-primary dark:bg-rdv-primary/15">
                    {profile.job}
                  </span>
                ) : null}
              </div>
            </div>
          </AppCard>

          <AppCard className="divide-y divide-rdv-divider">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex w-full items-center gap-3 px-4 py-3 text-left"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-rdv-primary" />
              ) : (
                <Moon className="h-5 w-5 text-rdv-primary" />
              )}
              <span className="font-semibold">
                Mode {theme === "dark" ? "clair" : "sombre"}
              </span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-rdv-nope"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-semibold">Se déconnecter</span>
            </button>
          </AppCard>
        </div>
      ) : null}
    </>
  );
}
