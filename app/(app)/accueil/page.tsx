"use client";

import { Bell, SlidersHorizontal } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { fetchFeed, swipe } from "@/lib/api/feed";
import { fetchUnreadNotificationCount } from "@/lib/api/profile";
import type { FeedProfile } from "@/lib/types";
import { ActionButtons } from "@/components/discovery/action-buttons";
import { ProfileCard } from "@/components/discovery/profile-card";
import {
  AppScreenAppBar,
  EmptyState,
  LoadingState,
} from "@/components/ui/app-primitives";

export default function AccueilPage() {
  const [profiles, setProfiles] = useState<FeedProfile[]>([]);
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [matchBanner, setMatchBanner] = useState<string | null>(null);
  const [badge, setBadge] = useState<string | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const active = profiles[index];

  const loadFeed = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchFeed({ page: 1, limit: 20 });
      setProfiles(data);
      setIndex(0);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Impossible de charger le feed.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFeed();
    void fetchUnreadNotificationCount().then(setUnreadNotifications);
  }, [loadFeed]);

  async function handleSwipe(liked: boolean, label: string) {
    if (!active || busy) return;
    setBusy(true);
    setBadge(label);
    try {
      const result = await swipe(active.userId, liked);
      if (result.match) {
        setMatchBanner(`C'est un match avec ${active.user?.name ?? "ce profil"} !`);
      }
      setProfiles((prev) => {
        const next = prev.filter((_, i) => i !== index);
        setIndex((current) =>
          next.length === 0 ? 0 : Math.min(current, next.length - 1),
        );
        return next;
      });
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Swipe impossible pour le moment.",
      );
    } finally {
      setBadge(null);
      setBusy(false);
    }
  }

  return (
    <>
      <AppScreenAppBar
        title="Découverte"
        actions={
          <>
            <button
              type="button"
              className="relative rounded-full p-2 hover:bg-white/10"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 ? (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-white" />
              ) : null}
            </button>
            <button
              type="button"
              className="rounded-full p-2 hover:bg-white/10"
              aria-label="Filtres"
            >
              <SlidersHorizontal className="h-5 w-5" />
            </button>
          </>
        }
      />

      <div className="flex flex-1 flex-col px-4 pt-4">
        {matchBanner ? (
          <div className="mb-4 rounded-2xl bg-gradient-to-r from-rdv-primary to-[#F56B8A] px-4 py-3 text-center text-sm font-bold text-white">
            {matchBanner}
            <button
              type="button"
              className="ml-2 underline"
              onClick={() => setMatchBanner(null)}
            >
              OK
            </button>
          </div>
        ) : null}

        {isLoading ? <LoadingState label="Chargement des profils…" /> : null}

        {!isLoading && error ? (
          <EmptyState
            title="Feed indisponible"
            description={error}
            action={
              <button
                type="button"
                onClick={() => void loadFeed()}
                className="rounded-full bg-rdv-primary px-5 py-2.5 text-sm font-bold text-white"
              >
                Réessayer
              </button>
            }
          />
        ) : null}

        {!isLoading && !error && !active ? (
          <EmptyState
            title="Plus de profils pour l'instant"
            description="Reviens un peu plus tard ou élargis tes filtres."
            action={
              <button
                type="button"
                onClick={() => void loadFeed()}
                className="rounded-full bg-rdv-primary px-5 py-2.5 text-sm font-bold text-white"
              >
                Actualiser
              </button>
            }
          />
        ) : null}

        {!isLoading && !error && active ? (
          <div className="flex flex-1 flex-col gap-5">
            <ProfileCard profile={active} badgeLabel={badge} />
            <div className="pb-2">
              <ActionButtons
                busy={busy}
                onPass={() => void handleSwipe(false, "Passer")}
                onLike={() => void handleSwipe(true, "Like")}
                onSuperLike={() => void handleSwipe(true, "SuperLike")}
              />
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
