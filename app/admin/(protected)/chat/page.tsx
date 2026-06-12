"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { fetchAdminConversations } from "@/lib/api/admin";
import type { AdminConversation } from "@/lib/types/admin";
import {
  AdminCard,
  AdminEmpty,
  AdminError,
  AdminLoading,
  AdminPageHeader,
  AdminPagination,
  AdminTable,
} from "@/components/admin/admin-ui";

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
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Erreur conversations");
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
        description="GET /admin/chat/conversations"
      />
      {isLoading ? <AdminLoading /> : null}
      {error ? <AdminError message={error} /> : null}
      {!isLoading && !error && items.length === 0 ? (
        <AdminEmpty message="Aucune conversation." />
      ) : null}
      {items.length > 0 ? (
        <AdminCard>
          <AdminTable headers={["ID", "Messages", "Dernier message", ""]}>
            {items.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 font-mono text-xs">{c.id.slice(0, 12)}…</td>
                <td className="px-4 py-3">{c.messageCount ?? "—"}</td>
                <td className="max-w-xs truncate px-4 py-3 text-sm">
                  {c.lastMessage?.content ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/chat/${c.id}`} className="text-rdv-primary hover:underline">
                    Ouvrir
                  </Link>
                </td>
              </tr>
            ))}
          </AdminTable>
          <AdminPagination page={page} hasMore={hasMore} total={total} onPageChange={setPage} />
        </AdminCard>
      ) : null}
    </div>
  );
}
