"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { ApiError } from "@/lib/api/client";
import { fetchAdminMatches } from "@/lib/api/admin";
import type { AdminMatch } from "@/lib/types/admin";
import {
  AdminCard,
  AdminEmpty,
  AdminError,
  AdminPageHeader,
  AdminPagination,
  AdminTable,
  AdminTableSkeleton,
  AdminUserAvatar,
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
        setError(null);
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
      <AdminPageHeader
        title="Matchs"
        description="Liste des mises en relation entre utilisateurs de l'application."
      />

      {isLoading ? <AdminTableSkeleton rows={6} /> : null}
      {error ? <AdminError message={error} /> : null}

      {!isLoading && !error && items.length === 0 ? (
        <AdminCard>
          <AdminEmpty message="Aucun match enregistré." icon={Heart} />
        </AdminCard>
      ) : null}

      {items.length > 0 ? (
        <AdminCard>
          <AdminTable headers={["Utilisateur 1", "", "Utilisateur 2", "Date"]}>
            {items.map((m) => (
              <tr key={m.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <AdminUserAvatar
                      name={m.user1?.name ?? "?"}
                      avatarUrl={m.user1?.profile?.avatarUrl}
                      size="sm"
                    />
                    <span className="font-semibold">{m.user1?.name ?? "—"}</span>
                  </div>
                </td>
                <td className="px-2 py-3 text-rdv-primary">♥</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <AdminUserAvatar
                      name={m.user2?.name ?? "?"}
                      avatarUrl={m.user2?.profile?.avatarUrl}
                      size="sm"
                    />
                    <span className="font-semibold">{m.user2?.name ?? "—"}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-rdv-muted">
                  {new Date(m.createdAt).toLocaleString("fr-FR")}
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
