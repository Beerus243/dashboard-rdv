"use client";

import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { fetchAdminHealth, fetchAdminRevenueStats } from "@/lib/api/admin";
import type { AdminHealth, StatRevenue } from "@/lib/types/admin";
import {
  AdminBadge,
  AdminCard,
  AdminError,
  AdminLoading,
  AdminPageHeader,
} from "@/components/admin/admin-ui";

export default function AdminHealthPage() {
  const [health, setHealth] = useState<AdminHealth | null>(null);
  const [revenue, setRevenue] = useState<StatRevenue | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [h, r] = await Promise.all([
          fetchAdminHealth(),
          fetchAdminRevenueStats(),
        ]);
        setHealth(h);
        setRevenue(r);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Erreur health");
      }
    }
    void load();
  }, []);

  if (!health && !error) return <AdminLoading />;
  if (error) return <AdminError message={error} />;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Infrastructure"
        description="GET /admin/health — GET /admin/stats/revenue"
      />
      <AdminCard className="p-4">
        <div className="mb-4 flex items-center gap-3">
          <span className="text-sm text-rdv-muted">Statut global</span>
          <AdminBadge variant={health?.status === "ok" ? "success" : "warning"}>
            {health?.status}
          </AdminBadge>
        </div>
        <p className="text-xs text-rdv-muted">
          {health?.timestamp
            ? new Date(health.timestamp).toLocaleString("fr-FR")
            : ""}
        </p>
        <ul className="mt-4 space-y-2">
          {health?.services
            ? Object.entries(health.services).map(([name, status]) => (
                <li
                  key={name}
                  className="flex justify-between text-sm text-rdv-text"
                >
                  <span className="capitalize">{name}</span>
                  <AdminBadge variant={status === "up" ? "success" : "danger"}>
                    {status}
                  </AdminBadge>
                </li>
              ))
            : null}
        </ul>
      </AdminCard>
      {revenue ? (
        <AdminCard className="p-4">
          <h2 className="text-[13px] font-bold text-rdv-text">Revenus (MVP)</h2>
          <p className="mt-2 text-sm text-rdv-muted">
            {revenue.enabled ? "Activé" : revenue.message ?? "Non activé"}
          </p>
        </AdminCard>
      ) : null}
    </div>
  );
}
