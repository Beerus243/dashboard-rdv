"use client";

import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { fetchAdminMatches } from "@/lib/api/admin";
import type { AdminMatch } from "@/lib/types/admin";
import {
  AdminCard,
  AdminEmpty,
  AdminError,
  AdminLoading,
  AdminPageHeader,
  AdminPagination,
  AdminTable,
} from "@/components/admin/admin-ui";

export default function AdminMatchesPage() {
  const [items, setItems] = useState<AdminMatch[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const res = await fetchAdminMatches({ page, limit: 20 });
        setItems(res.data);
        setTotal(res.meta.total);
        setHasMore(res.meta.hasMore);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Erreur matchs");
      } finally {
        setIsLoading(false);
      }
    }
    void load();
  }, [page]);

  return (
    <div>
      <AdminPageHeader title="Matchs" description="GET /admin/matches" />
      {isLoading ? <AdminLoading /> : null}
      {error ? <AdminError message={error} /> : null}
      {!isLoading && !error && items.length === 0 ? (
        <AdminEmpty message="Aucun match." />
      ) : null}
      {items.length > 0 ? (
        <AdminCard>
          <AdminTable headers={["Utilisateur 1", "Utilisateur 2", "Date"]}>
            {items.map((m) => (
              <tr key={m.id}>
                <td className="px-4 py-3">{m.user1?.name ?? "—"}</td>
                <td className="px-4 py-3">{m.user2?.name ?? "—"}</td>
                <td className="px-4 py-3 text-xs">
                  {new Date(m.createdAt).toLocaleString("fr-FR")}
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
