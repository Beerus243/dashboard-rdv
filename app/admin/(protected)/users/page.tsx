"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { banAdminUser, fetchAdminUsers } from "@/lib/api/admin";
import type { AdminUserListItem } from "@/lib/types/admin";
import {
  AdminBadge,
  AdminButton,
  AdminCard,
  AdminEmpty,
  AdminError,
  AdminLoading,
  AdminPageHeader,
  AdminPagination,
  AdminSearchInput,
  AdminTable,
} from "@/components/admin/admin-ui";

export default function AdminUsersPage() {
  const [items, setItems] = useState<AdminUserListItem[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchAdminUsers({
        page,
        limit: 20,
        search: search || undefined,
      });
      setItems(res.data);
      setTotal(res.meta.total);
      setHasMore(res.meta.hasMore);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erreur chargement utilisateurs");
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const t = setTimeout(() => void load(), search ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, search]);

  async function handleBan(id: string) {
    if (!confirm("Bannir cet utilisateur ?")) return;
    try {
      await banAdminUser(id);
      void load();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Échec du ban");
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Utilisateurs"
        description="GET /admin/users — liste paginée avec recherche"
        actions={<AdminSearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} />}
      />
      {isLoading && items.length === 0 ? <AdminLoading /> : null}
      {error ? <AdminError message={error} /> : null}
      {!isLoading && !error && items.length === 0 ? (
        <AdminEmpty message="Aucun utilisateur trouvé." />
      ) : null}
      {items.length > 0 ? (
        <AdminCard>
          <AdminTable headers={["Nom", "E-mail", "Statut", "Matchs", "Signalements", "Actions"]}>
            {items.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3">
                  <Link href={`/admin/users/${u.id}`} className="font-semibold text-rdv-text hover:text-rdv-primary">
                    {u.name}
                  </Link>
                  {u.adminRole ? (
                    <AdminBadge variant="warning">{u.adminRole}</AdminBadge>
                  ) : null}
                </td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">
                  <AdminBadge variant={u.isActive ? "success" : "danger"}>
                    {u.isActive ? "Actif" : "Banni"}
                  </AdminBadge>
                </td>
                <td className="px-4 py-3">{u.matchCount}</td>
                <td className="px-4 py-3">{u.reportCount}</td>
                <td className="px-4 py-3">
                  {u.isActive ? (
                    <AdminButton variant="danger" onClick={() => void handleBan(u.id)}>
                      Ban
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
