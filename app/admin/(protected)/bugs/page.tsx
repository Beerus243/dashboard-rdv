"use client";

import { useCallback, useEffect, useState } from "react";
import { Bug } from "lucide-react";
import { ApiError } from "@/lib/api/client";
import { fetchAdminBugs } from "@/lib/api/admin";
import type { AdminBugReport, BugReportStatus } from "@/lib/types/admin";
import {
  AdminBadge,
  AdminCard,
  AdminEmpty,
  AdminError,
  AdminFilterTabs,
  AdminPageHeader,
  AdminPagination,
  AdminTable,
  AdminTableSkeleton,
} from "@/components/admin/admin-ui";

const STATUS_LABELS: Record<BugReportStatus, string> = {
  OPEN: "Ouvert",
  IN_PROGRESS: "En cours",
  RESOLVED: "Résolu",
  CLOSED: "Fermé",
};

const STATUS_VARIANT: Record<
  BugReportStatus,
  "default" | "warning" | "success" | "danger"
> = {
  OPEN: "danger",
  IN_PROGRESS: "warning",
  RESOLVED: "success",
  CLOSED: "default",
};

type FilterValue = BugReportStatus | "ALL";

export default function AdminBugsPage() {
  const [items, setItems] = useState<AdminBugReport[]>([]);
  const [status, setStatus] = useState<FilterValue>("OPEN");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filterOptions: { value: FilterValue; label: string }[] = [
    { value: "ALL", label: "Tous" },
    ...(
      Object.keys(STATUS_LABELS) as BugReportStatus[]
    ).map((s) => ({ value: s, label: STATUS_LABELS[s] })),
  ];

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchAdminBugs({
        page,
        limit: 20,
        status: status === "ALL" ? undefined : status,
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
        title="Bugs app"
        description="Retours techniques envoyés par les utilisateurs depuis l'application mobile."
        actions={
          <AdminFilterTabs
            options={filterOptions}
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
            message="Aucun bug signalé pour ce filtre."
            icon={Bug}
          />
        </AdminCard>
      ) : null}

      {items.length > 0 ? (
        <AdminCard className={isLoading ? "opacity-60" : undefined}>
          <AdminTable
            headers={[
              "Problème",
              "Utilisateur",
              "Plateforme",
              "Version",
              "Statut",
              "Date",
            ]}
          >
            {items.map((b) => (
              <tr key={b.id}>
                <td className="max-w-sm px-4 py-3">
                  <p className="font-semibold text-rdv-text">{b.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-rdv-muted">
                    {b.description}
                  </p>
                </td>
                <td className="px-4 py-3 text-sm">
                  <p className="font-medium">{b.user?.name ?? "—"}</p>
                  {b.user?.email ? (
                    <p className="text-xs text-rdv-muted">{b.user.email}</p>
                  ) : null}
                </td>
                <td className="px-4 py-3 capitalize">{b.platform}</td>
                <td className="px-4 py-3 font-mono text-xs">{b.appVersion}</td>
                <td className="px-4 py-3">
                  <AdminBadge variant={STATUS_VARIANT[b.status]} dot>
                    {STATUS_LABELS[b.status]}
                  </AdminBadge>
                </td>
                <td className="px-4 py-3 text-xs text-rdv-muted">
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
