"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { fetchAdminBugs } from "@/lib/api/admin";
import type { AdminBugReport, BugReportStatus } from "@/lib/types/admin";
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

const STATUS_FILTERS: BugReportStatus[] = [
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
];

const STATUS_VARIANT: Record<
  BugReportStatus,
  "default" | "warning" | "success" | "danger"
> = {
  OPEN: "danger",
  IN_PROGRESS: "warning",
  RESOLVED: "success",
  CLOSED: "default",
};

export default function AdminBugsPage() {
  const [items, setItems] = useState<AdminBugReport[]>([]);
  const [status, setStatus] = useState<BugReportStatus | "">("OPEN");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchAdminBugs({
        page,
        limit: 20,
        status: status || undefined,
      });
      setItems(res.data);
      setTotal(res.meta.total);
      setHasMore(res.meta.hasMore);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erreur chargement bugs");
    } finally {
      setIsLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      <AdminPageHeader
        title="Signalements bugs"
        description="GET /admin/bugs — soumis par l'app via POST /bugs"
        actions={
          <div className="flex flex-wrap gap-2">
            <AdminButton
              variant={status === "" ? "primary" : "ghost"}
              onClick={() => {
                setStatus("");
                setPage(1);
              }}
            >
              Tous
            </AdminButton>
            {STATUS_FILTERS.map((s) => (
              <AdminButton
                key={s}
                variant={status === s ? "primary" : "ghost"}
                onClick={() => {
                  setStatus(s);
                  setPage(1);
                }}
              >
                {s}
              </AdminButton>
            ))}
          </div>
        }
      />

      {isLoading && items.length === 0 ? <AdminLoading /> : null}
      {error ? <AdminError message={error} /> : null}
      {!isLoading && !error && items.length === 0 ? (
        <AdminEmpty message="Aucun signalement bug." />
      ) : null}

      {items.length > 0 ? (
        <AdminCard>
          <AdminTable
            headers={[
              "Titre",
              "Utilisateur",
              "Plateforme",
              "Version",
              "Statut",
              "Date",
            ]}
          >
            {items.map((b) => (
              <tr key={b.id}>
                <td className="max-w-xs px-4 py-3">
                  <p className="font-semibold text-rdv-text">{b.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-rdv-muted">
                    {b.description}
                  </p>
                </td>
                <td className="px-4 py-3 text-sm">
                  {b.user?.name ?? "—"}
                  {b.user?.email ? (
                    <p className="text-xs text-rdv-muted">{b.user.email}</p>
                  ) : null}
                </td>
                <td className="px-4 py-3 capitalize">{b.platform}</td>
                <td className="px-4 py-3">{b.appVersion}</td>
                <td className="px-4 py-3">
                  <AdminBadge variant={STATUS_VARIANT[b.status]}>
                    {b.status}
                  </AdminBadge>
                </td>
                <td className="px-4 py-3 text-xs">
                  {new Date(b.createdAt).toLocaleString("fr-FR")}
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
