"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { fetchExploreCatalog } from "@/lib/api/profile";
import { resolveImageUrl } from "@/lib/api/config";
import type { ExploreInterest } from "@/lib/types";
import {
  AppCard,
  AppScreenAppBar,
  EmptyState,
  LoadingState,
} from "@/components/ui/app-primitives";

export default function ExplorePage() {
  const [interests, setInterests] = useState<ExploreInterest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchExploreCatalog();
        setInterests(data);
      } catch (err) {
        setError(
          err instanceof ApiError
            ? err.message
            : "Explorateur indisponible.",
        );
      } finally {
        setIsLoading(false);
      }
    }
    void load();
  }, []);

  return (
    <>
      <AppScreenAppBar title="Explorer" />
      <div className="px-4 py-4">
        <div className="mb-4 rounded-[20px] bg-gradient-to-br from-rdv-primary to-[#F56B8A] p-5 text-white">
          <h2 className="text-xl font-extrabold">Trouve ta vibe</h2>
          <p className="mt-1 text-sm text-white/90">
            Parcours des univers par centres d&apos;intérêt, comme dans l&apos;app mobile.
          </p>
        </div>

        {isLoading ? <LoadingState /> : null}
        {!isLoading && error ? (
          <EmptyState title="Erreur" description={error} />
        ) : null}

        {!isLoading && !error ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {interests.map((item) => (
              <AppCard key={item.id} className="overflow-hidden">
                <div className="relative h-36 bg-rdv-primary/10">
                  {item.imageUrl ? (
                    <Image
                      src={resolveImageUrl(item.imageUrl)}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-4xl">
                      ✨
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                    <h3 className="font-extrabold">{item.name}</h3>
                    {item.subtitle ? (
                      <p className="text-xs text-white/85">{item.subtitle}</p>
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-rdv-muted">
                  <span>{item.slug}</span>
                  {item.nearbyProfiles != null ? (
                    <span>{item.nearbyProfiles} profils</span>
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
