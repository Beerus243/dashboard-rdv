"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { closeAdminReport, fetchAdminReports } from "@/lib/api/admin";
import type { AdminReport, ReportStatus } from "@/lib/types/admin";
import {
  AdminBadge,
  AdminButton,
  AdminCard,
  AdminEmpty,
  AdminError,
  AdminLoading,
  AdminPageHeader,
  AdminPagination,
  AdminTable,
} from "@/components/admin/admin-ui";

const filters: ReportStatus[] = ["OPEN", "CLOSED"];

export default function AdminReportsPage() {
  const [items, setItems] = useState<AdminReport[]>([]);
  const [status, setStatus] = useState<ReportStatus>("OPEN");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchAdminReports({ page, limit: 20, status });
      setItems(res.data);
      setTotal(res.meta.total);
      setHasMore(res.meta.hasMore);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erreur signalements");
    } finally {
      setIsLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleClose(id: string) {
    const resolution = prompt("Résolution (optionnel) :") ?? undefined;
    try {
      await closeAdminReport(id, resolution);
      void load();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Échec clôture");
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Signalements"
        description="GET /admin/reports — POST /admin/reports/:id/close"
        actions={
          <div className="flex gap-2">
            {filters.map((f) => (
              <AdminButton
                key={f}
                variant={status === f ? "primary" : "ghost"}
                onClick={() => { setStatus(f); setPage(1); }}
              >
                {f}
              </AdminButton>
            ))}
          </div>
        }
      />
      {isLoading && items.length === 0 ? <AdminLoading /> : null}
      {error ? <AdminError message={error} /> : null}
      {!isLoading && !error && items.length === 0 ? (
        <AdminEmpty message={`Aucun signalement ${status}.`} />
      ) : null}
      {items.length > 0 ? (
        <AdminCard>
          <AdminTable headers={["Signalé", "Motif", "Statut", "Date", "Action"]}>
            {items.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3">{r.reported?.name ?? "—"}</td>
                <td className="px-4 py-3">{r.reason}</td>
                <td className="px-4 py-3">
                  <AdminBadge variant={r.status === "OPEN" ? "warning" : "success"}>
                    {r.status}
                  </AdminBadge>
                </td>
                <td className="px-4 py-3 text-xs">
                  {new Date(r.createdAt).toLocaleString("fr-FR")}
                </td>
                <td className="px-4 py-3">
                  {r.status === "OPEN" ? (
                    <AdminButton variant="primary" onClick={() => void handleClose(r.id)}>
                      Clôturer
                    </AdminButton>
                  ) : null}
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
