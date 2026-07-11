"use client";

import { useCallback, useEffect, useState } from "react";
import { Flag } from "lucide-react";
import { ApiError } from "@/lib/api/client";
import { closeAdminReport, fetchAdminReports } from "@/lib/api/admin";
import type { AdminReport, ReportStatus } from "@/lib/types/admin";
import {
  AdminBadge,
  AdminButton,
  AdminCard,
  AdminEmpty,
  AdminError,
  AdminFilterTabs,
  AdminPageHeader,
  AdminPagination,
  AdminTable,
  AdminTableSkeleton,
} from "@/components/admin/admin-ui";

const filters: { value: ReportStatus; label: string }[] = [
  { value: "OPEN", label: "Ouverts" },
  { value: "CLOSED", label: "Clôturés" },
];

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
        description="Traitez les reports entre utilisateurs et clôturez les dossiers résolus."
        actions={
          <AdminFilterTabs
            options={filters}
            value={status}
            onChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
          />
        }
      />

      {isLoading && items.length === 0 ? <AdminTableSkeleton rows={5} /> : null}
      {error ? <AdminError message={error} onRetry={() => void load()} /> : null}

      {!isLoading && !error && items.length === 0 ? (
        <AdminCard>
          <AdminEmpty
            message={
              status === "OPEN"
                ? "Aucun signalement ouvert — tout est calme."
                : "Aucun signalement clôturé pour l'instant."
            }
            icon={Flag}
          />
        </AdminCard>
      ) : null}

      {items.length > 0 ? (
        <AdminCard className={isLoading ? "opacity-60" : undefined}>
          <AdminTable
            headers={["Signalé", "Par", "Motif", "Statut", "Date", ""]}
          >
            {items.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3 font-semibold">
                  {r.reported?.name ?? "—"}
                </td>
                <td className="px-4 py-3 text-rdv-muted">
                  {r.reporter?.name ?? "—"}
                </td>
                <td className="max-w-xs px-4 py-3">
                  <p className="font-medium">{r.reason}</p>
                  {r.description ? (
                    <p className="mt-0.5 line-clamp-1 text-xs text-rdv-muted">
                      {r.description}
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  <AdminBadge
                    variant={r.status === "OPEN" ? "danger" : "success"}
                    dot
                  >
                    {r.status === "OPEN" ? "Ouvert" : "Clôturé"}
                  </AdminBadge>
                </td>
                <td className="px-4 py-3 text-xs text-rdv-muted">
                  {new Date(r.createdAt).toLocaleString("fr-FR")}
                </td>
                <td className="px-4 py-3">
                  {r.status === "OPEN" ? (
                    <AdminButton
                      variant="primary"
                      size="sm"
                      onClick={() => void handleClose(r.id)}
                    >
                      Clôturer
                    </AdminButton>
                  ) : null}
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
