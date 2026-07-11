"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { ApiError } from "@/lib/api/client";
import { fetchAdminConversations } from "@/lib/api/admin";
import type { AdminConversation } from "@/lib/types/admin";
import {
  AdminBadge,
  AdminButton,
  AdminCard,
  AdminEmpty,
  AdminError,
  AdminPageHeader,
  AdminPagination,
  AdminTable,
  AdminTableSkeleton,
  AdminUserAvatar,
} from "@/components/admin/admin-ui";

function formatParticipants(c: AdminConversation): string {
  if (!c.participants?.length) return "Conversation";
  return c.participants.map((p) => p.name).join(" · ");
}

export default function AdminChatPage() {
  const [items, setItems] = useState<AdminConversation[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const res = await fetchAdminConversations({ page, limit: 20 });
        setItems(res.data);
        setTotal(res.meta.total);
        setHasMore(res.meta.hasMore);
        setError(null);
      } catch (err) {
        setError(
          err instanceof ApiError ? err.message : "Erreur conversations",
        );
      } finally {
        setIsLoading(false);
      }
    }
    void load();
  }, [page]);

  return (
    <div>
      <AdminPageHeader
        title="Chat"
        description="Parcourez les conversations et consultez les échanges entre utilisateurs."
      />

      {isLoading ? <AdminTableSkeleton rows={6} /> : null}
      {error ? <AdminError message={error} /> : null}

      {!isLoading && !error && items.length === 0 ? (
        <AdminCard>
          <AdminEmpty
            message="Aucune conversation pour le moment."
            icon={MessageSquare}
          />
        </AdminCard>
      ) : null}

      {items.length > 0 ? (
        <AdminCard>
          <AdminTable headers={["Participants", "Messages", "Dernier message", ""]}>
            {items.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {(c.participants ?? []).slice(0, 2).map((p) => (
                        <AdminUserAvatar
                          key={p.id}
                          name={p.name}
                          avatarUrl={p.avatarUrl}
                          size="sm"
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-rdv-text">
                      {formatParticipants(c)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <AdminBadge variant="info">
                    {c.messageCount ?? 0}
                  </AdminBadge>
                </td>
                <td className="max-w-xs px-4 py-3">
                  <p className="truncate text-sm text-rdv-text">
                    {c.lastMessage?.content ?? "—"}
                  </p>
                  {c.lastMessage?.createdAt ? (
                    <p className="text-xs text-rdv-muted">
                      {new Date(c.lastMessage.createdAt).toLocaleString("fr-FR")}
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/chat/${c.id}`}>
                    <AdminButton variant="ghost" size="sm">
                      Ouvrir
                    </AdminButton>
                  </Link>
                </td>
              </tr>
            ))}
          </AdminTable>
          <AdminPagination
            page={page}
            hasMore={hasMore}
            total={total}
            onPageChange={setPage}
          />
        </AdminCard>
      ) : null}
    </div>
  );
}
