"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
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
  AdminLoading,
  AdminPageHeader,
  AdminTable,
} from "@/components/admin/admin-ui";

type Tab = "photos" | "messages";

export default function AdminModerationPage() {
  const [tab, setTab] = useState<Tab>("photos");
  const [photoStatus, setPhotoStatus] = useState<PhotoModerationStatus>("PENDING");
  const [photos, setPhotos] = useState<AdminModerationPhoto[]>([]);
  const [messages, setMessages] = useState<AdminModerationMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      if (tab === "photos") {
        const res = await fetchModerationPhotos({ status: photoStatus, limit: 30 });
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

  return (
    <div>
      <AdminPageHeader
        title="Modération"
        description="GET/POST /admin/moderation/photos — GET /admin/moderation/messages"
        actions={
          <div className="flex gap-2">
            <AdminButton variant={tab === "photos" ? "primary" : "ghost"} onClick={() => setTab("photos")}>
              Photos
            </AdminButton>
            <AdminButton variant={tab === "messages" ? "primary" : "ghost"} onClick={() => setTab("messages")}>
              Messages
            </AdminButton>
          </div>
        }
      />

      {tab === "photos" ? (
        <div className="mb-4 flex gap-2">
          {(["PENDING", "APPROVED", "REJECTED"] as const).map((s) => (
            <AdminButton
              key={s}
              variant={photoStatus === s ? "primary" : "ghost"}
              onClick={() => setPhotoStatus(s)}
            >
              {s}
            </AdminButton>
          ))}
        </div>
      ) : null}

      {isLoading ? <AdminLoading /> : null}
      {error ? <AdminError message={error} /> : null}

      {tab === "photos" && !isLoading && !error ? (
        photos.length === 0 ? (
          <AdminEmpty message="Aucune photo dans cette file." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((p) => (
              <AdminCard key={p.id} className="overflow-hidden">
                <div className="relative aspect-square bg-rdv-message">
                  <Image src={resolveImageUrl(p.url)} alt="" fill className="object-cover" unoptimized />
                </div>
                <div className="space-y-2 p-3">
                  <p className="text-sm font-semibold text-rdv-text">
                    {p.profile?.user?.name ?? "Utilisateur"}
                  </p>
                  <AdminBadge>{p.moderationStatus}</AdminBadge>
                  {photoStatus === "PENDING" ? (
                    <div className="flex gap-2 pt-1">
                      <AdminButton variant="primary" onClick={() => void handlePhoto(p.id, "approve")}>
                        Approuver
                      </AdminButton>
                      <AdminButton variant="danger" onClick={() => void handlePhoto(p.id, "reject")}>
                        Refuser
                      </AdminButton>
                    </div>
                  ) : null}
                </div>
              </AdminCard>
            ))}
          </div>
        )
      ) : null}

      {tab === "messages" && !isLoading && !error ? (
        messages.length === 0 ? (
          <AdminEmpty message="Aucun message de users signalés." />
        ) : (
          <AdminCard>
            <AdminTable headers={["Expéditeur", "Message", "Date"]}>
              {messages.map((m) => (
                <tr key={m.id}>
                  <td className="px-4 py-3">{m.sender?.name ?? "—"}</td>
                  <td className="max-w-md truncate px-4 py-3">{m.content}</td>
                  <td className="px-4 py-3 text-xs">
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
