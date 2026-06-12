"use client";

import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { resolveImageUrl } from "@/lib/api/config";
import type { FeedProfile } from "@/lib/types";

type ProfileCardProps = {
  profile: FeedProfile;
  badgeLabel?: string | null;
  className?: string;
};

function profilePhotos(profile: FeedProfile): string[] {
  const fromPhotos = (profile.photos ?? [])
    .map((p) => p.url)
    .filter(Boolean);
  if (fromPhotos.length) return fromPhotos.map(resolveImageUrl);
  if (profile.avatarUrl) return [resolveImageUrl(profile.avatarUrl)];
  return [];
}

export function ProfileCard({ profile, badgeLabel, className }: ProfileCardProps) {
  const photos = profilePhotos(profile);
  const photo = photos[0];
  const name = profile.user?.name ?? "Membre";
  const age = profile.age;
  const city = profile.city;
  const job = profile.job;
  const bio = profile.bio;

  return (
    <div
      className={cn(
        "relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-[24px] bg-rdv-surface shadow-lg",
        className,
      )}
    >
      {photo ? (
        <Image
          src={photo}
          alt={`Photo de ${name}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 420px"
          unoptimized
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-gradient-to-br from-rdv-primary/30 to-rdv-secondary/20">
          <span className="text-6xl font-black text-white/80">
            {name.charAt(0).toUpperCase()}
          </span>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

      {badgeLabel ? (
        <div className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white backdrop-blur-sm">
          {badgeLabel}
        </div>
      ) : null}

      {profile.isOnline ? (
        <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-rdv-like" />
          En ligne
        </div>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        <div className="flex items-end gap-2">
          <h2 className="text-3xl font-extrabold tracking-tight">
            {name}
            {age ? `, ${age}` : ""}
          </h2>
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-sm font-semibold">
          {city ? (
            <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm">
              {city}
            </span>
          ) : null}
          {job ? (
            <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm">
              {job}
            </span>
          ) : null}
          {profile.distanceKm != null ? (
            <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm">
              {profile.distanceKm.toFixed(1)} km
            </span>
          ) : null}
        </div>
        {bio ? (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/90">
            {bio}
          </p>
        ) : null}
      </div>
    </div>
  );
}
