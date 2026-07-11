"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Check, ImageIcon, MessageSquare, X } from "lucide-react";
import { ApiError } from "@/lib/api/client";
import {
  fetchModerationMessages,
  fetchModerationPhotos,
  moderatePhoto,
} from "@/lib/api/admin";
import { resolveImageUrl } from "@/lib/api/config";
import type {
  AdminModerationMessage,
  AdminModerationPhoto,
  PhotoModerationStatus,
} from "@/lib/types/admin";
import {
  AdminBadge,
  AdminButton,
  AdminCard,
  AdminEmpty,
  AdminError,
  AdminFilterTabs,
  AdminPageHeader,
  AdminSkeleton,
  AdminTable,
} from "@/components/admin/admin-ui";

type Tab = "photos" | "messages";

const PHOTO_STATUS_LABELS: Record<PhotoModerationStatus, string> = {
  PENDING: "En attente",
  APPROVED: "Approuvées",
  REJECTED: "Refusées",
};

export default function AdminModerationPage() {
  const [tab, setTab] = useState<Tab>("photos");
  const [photoStatus, setPhotoStatus] =
    useState<PhotoModerationStatus>("PENDING");
  const [photos, setPhotos] = useState<AdminModerationPhoto[]>([]);
  const [messages, setMessages] = useState<AdminModerationMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      if (tab === "photos") {
        const res = await fetchModerationPhotos({
          status: photoStatus,
          limit: 30,
        });
        setPhotos(res.data);
      } else {
        const res = await fetchModerationMessages({ limit: 30 });
        setMessages(res.data);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erreur modération");
    } finally {
      setIsLoading(false);
    }
  }, [tab, photoStatus]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handlePhoto(id: string, action: "approve" | "reject") {
    try {
      await moderatePhoto(id, action);
      void load();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Échec modération");
    }
  }

  const tabOptions: { value: Tab; label: string }[] = [
    { value: "photos", label: "Photos" },
    { value: "messages", label: "Messages" },
  ];

  const photoFilters = (
    ["PENDING", "APPROVED", "REJECTED"] as const
  ).map((s) => ({ value: s, label: PHOTO_STATUS_LABELS[s] }));

  return (
    <div>
      <AdminPageHeader
        title="Modération"
        description="Validez les photos uploadées et consultez les messages signalés."
        actions={
          <AdminFilterTabs options={tabOptions} value={tab} onChange={setTab} />
        }
      />

      {tab === "photos" ? (
        <div className="mb-4">
          <AdminFilterTabs
            options={photoFilters}
            value={photoStatus}
            onChange={setPhotoStatus}
          />
        </div>
      ) : null}

      {isLoading ? (
        tab === "photos" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <AdminSkeleton key={i} className="aspect-square w-full rounded-[var(--rdv-radius-card)]" />
            ))}
          </div>
        ) : (
          <AdminSkeleton className="h-64 w-full" />
        )
      ) : null}

      {error ? <AdminError message={error} onRetry={() => void load()} /> : null}

      {tab === "photos" && !isLoading && !error ? (
        photos.length === 0 ? (
          <AdminCard>
            <AdminEmpty
              message="Aucune photo dans cette file."
              icon={ImageIcon}
            />
          </AdminCard>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((p) => (
              <AdminCard key={p.id} className="overflow-hidden">
                <div className="relative aspect-[4/5] bg-rdv-message">
                  <Image
                    src={resolveImageUrl(p.url)}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  {photoStatus === "PENDING" ? (
                    <div className="absolute inset-x-0 bottom-0 flex gap-2 bg-gradient-to-t from-black/70 to-transparent p-3 pt-10">
                      <AdminButton
                        variant="primary"
                        size="sm"
                        className="flex-1"
                        onClick={() => void handlePhoto(p.id, "approve")}
                      >
                        <Check className="h-4 w-4" />
                        OK
                      </AdminButton>
                      <AdminButton
                        variant="danger"
                        size="sm"
                        className="flex-1"
                        onClick={() => void handlePhoto(p.id, "reject")}
                      >
                        <X className="h-4 w-4" />
                        Refuser
                      </AdminButton>
                    </div>
                  ) : null}
                </div>
                <div className="space-y-2 p-3">
                  <p className="text-sm font-semibold text-rdv-text">
                    {p.profile?.user?.name ?? "Utilisateur"}
                  </p>
                  <AdminBadge
                    variant={
                      p.moderationStatus === "APPROVED"
                        ? "success"
                        : p.moderationStatus === "REJECTED"
                          ? "danger"
                          : "warning"
                    }
                  >
                    {PHOTO_STATUS_LABELS[p.moderationStatus]}
                  </AdminBadge>
                </div>
              </AdminCard>
            ))}
          </div>
        )
      ) : null}

      {tab === "messages" && !isLoading && !error ? (
        messages.length === 0 ? (
          <AdminCard>
            <AdminEmpty
              message="Aucun message de profils signalés."
              icon={MessageSquare}
            />
          </AdminCard>
        ) : (
          <AdminCard>
            <AdminTable headers={["Expéditeur", "Message", "Date"]}>
              {messages.map((m) => (
                <tr key={m.id}>
                  <td className="px-4 py-3 font-semibold">
                    {m.sender?.name ?? "—"}
                  </td>
                  <td className="max-w-md px-4 py-3">
                    <p className="line-clamp-2">{m.content}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-rdv-muted">
                    {new Date(m.createdAt).toLocaleString("fr-FR")}
                  </td>
                </tr>
              ))}
            </AdminTable>
          </AdminCard>
        )
      ) : null}
    </div>
  );
}
