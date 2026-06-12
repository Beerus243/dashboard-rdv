"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { fetchReceivedLikes } from "@/lib/api/feed";
import { resolveImageUrl } from "@/lib/api/config";
import type { LikePreview } from "@/lib/types";
import {
  AppCard,
  AppScreenAppBar,
  EmptyState,
  LoadingState,
} from "@/components/ui/app-primitives";
import { cn } from "@/lib/utils/cn";

const filters = ["Tous", "Nouveaux", "À proximité"] as const;

export default function LikesPage() {
  const [likes, setLikes] = useState<LikePreview[]>([]);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState<(typeof filters)[number]>("Tous");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const result = await fetchReceivedLikes(1, 20);
        setLikes(result.items ?? []);
        setTotal(result.total ?? result.items?.length ?? 0);
      } catch (err) {
        setError(
          err instanceof ApiError
            ? err.message
            : "Impossible de charger les likes.",
        );
      } finally {
        setIsLoading(false);
      }
    }
    void load();
  }, []);

  return (
    <>
      <AppScreenAppBar title="J'aime" />
      <div className="px-4 py-4">
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors",
                filter === item
                  ? "bg-rdv-primary text-white"
                  : "bg-rdv-surface text-rdv-muted border border-rdv-divider",
              )}
            >
              {item}
            </button>
          ))}
        </div>

        <p className="mb-4 text-sm font-semibold text-rdv-muted">
          {total} personne{total > 1 ? "s" : ""} t&apos;ont liké
        </p>

        {isLoading ? <LoadingState /> : null}
        {!isLoading && error ? (
          <EmptyState title="Likes indisponibles" description={error} />
        ) : null}

        {!isLoading && !error && likes.length === 0 ? (
          <EmptyState
            title="Aucun like pour le moment"
            description="Continue à swiper — tes admirateurs apparaîtront ici."
          />
        ) : null}

        {!isLoading && !error && likes.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {likes.map((like) => (
              <AppCard key={like.id} className="overflow-hidden">
                <div className="relative aspect-[3/4] bg-rdv-primary/10">
                  {like.avatarUrl ? (
                    <Image
                      src={resolveImageUrl(like.avatarUrl)}
                      alt={like.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-3xl font-black text-rdv-primary">
                      {like.name.charAt(0)}
                    </div>
                  )}
                  {like.isOnline ? (
                    <span className="absolute right-2 top-2 h-3 w-3 rounded-full border-2 border-white bg-rdv-like" />
                  ) : null}
                </div>
                <div className="p-3">
                  <p className="font-bold text-rdv-text">
                    {like.name}
                    {like.age ? `, ${like.age}` : ""}
                  </p>
                  {like.city ? (
                    <p className="text-xs text-rdv-muted">{like.city}</p>
                  ) : null}
                </div>
              </AppCard>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
}
