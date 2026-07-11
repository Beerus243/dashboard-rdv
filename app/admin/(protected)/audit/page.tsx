"use client";

import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { fetchAdminAuditLogs } from "@/lib/api/admin";
import type { AdminAuditLog } from "@/lib/types/admin";
import {
  AdminCard,
  AdminEmpty,
  AdminError,
  AdminPageHeader,
  AdminPagination,
  AdminTable,
  AdminTableSkeleton,
} from "@/components/admin/admin-ui";

export default function AdminAuditPage() {
  const [items, setItems] = useState<AdminAuditLog[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const res = await fetchAdminAuditLogs({ page, limit: 30 });
        setItems(res.data);
        setTotal(res.meta.total);
        setHasMore(res.meta.hasMore);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Erreur audit");
      } finally {
        setIsLoading(false);
      }
    }
    void load();
  }, [page]);

  return (
    <div>
      <AdminPageHeader
        title="Journal d'audit"
        description="Historique des actions sensibles effectuées par les administrateurs."
      />
      {isLoading ? <AdminTableSkeleton rows={8} /> : null}
      {error ? <AdminError message={error} /> : null}
      {!isLoading && !error && items.length === 0 ? (
        <AdminEmpty message="Aucune entrée d'audit." />
      ) : null}
      {items.length > 0 ? (
        <AdminCard>
          <AdminTable headers={["Action", "Admin", "Cible", "Date"]}>
            {items.map((log) => (
              <tr key={log.id}>
                <td className="px-4 py-3 font-mono text-xs">{log.action}</td>
                <td className="px-4 py-3">{log.admin?.name ?? "—"}</td>
                <td className="px-4 py-3 text-xs">
                  {log.targetType ?? "—"} {log.targetId?.slice(0, 8) ?? ""}
                </td>
                <td className="px-4 py-3 text-xs">
                  {new Date(log.createdAt).toLocaleString("fr-FR")}
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
