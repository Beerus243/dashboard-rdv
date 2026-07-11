"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { fetchAdminConversationMessages } from "@/lib/api/admin";
import type { AdminChatMessage } from "@/lib/types/admin";
import {
  AdminCard,
  AdminEmpty,
  AdminError,
  AdminLoading,
  AdminPageHeader,
  AdminUserAvatar,
} from "@/components/admin/admin-ui";

export default function AdminChatDetailPage() {
  const params = useParams<{ id: string }>();
  const [messages, setMessages] = useState<AdminChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchAdminConversationMessages(params.id, {
          limit: 50,
        });
        setMessages(res.data);
      } catch (err) {
        setError(
          err instanceof ApiError ? err.message : "Conversation introuvable",
        );
      } finally {
        setIsLoading(false);
      }
    }
    void load();
  }, [params.id]);

  if (isLoading) return <AdminLoading label="Chargement des messages…" />;
  if (error) return <AdminError message={error} />;

  return (
    <div>
      <AdminPageHeader
        title="Conversation"
        description={`${messages.length} message${messages.length > 1 ? "s" : ""}`}
        backHref="/admin/chat"
      />

      {messages.length === 0 ? (
        <AdminCard>
          <AdminEmpty message="Cette conversation ne contient aucun message." />
        </AdminCard>
      ) : (
        <AdminCard className="p-4">
          <div className="max-h-[70vh] space-y-3 overflow-y-auto">
            {messages.map((m) => (
              <div key={m.id} className="flex items-end gap-2">
                <AdminUserAvatar
                  name={m.sender?.name ?? "?"}
                  avatarUrl={m.sender?.avatarUrl}
                  size="sm"
                />
                <div className="max-w-[85%] rounded-[var(--rdv-radius-input)] rounded-bl-sm bg-rdv-message px-3 py-2">
                  <p className="text-xs font-semibold text-rdv-primary">
                    {m.sender?.name ?? "Inconnu"}
                  </p>
                  <p className="mt-0.5 text-sm text-rdv-text">{m.content}</p>
                  <p className="mt-1 text-[10px] text-rdv-muted">
                    {new Date(m.createdAt).toLocaleString("fr-FR")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      )}
    </div>
  );
}
