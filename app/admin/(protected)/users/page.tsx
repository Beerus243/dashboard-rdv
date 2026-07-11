"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Ban, ChevronRight } from "lucide-react";
import { ApiError } from "@/lib/api/client";
import { banAdminUser, fetchAdminUsers } from "@/lib/api/admin";
import type { AdminUserListItem } from "@/lib/types/admin";
import {
  AdminBadge,
  AdminButton,
  AdminCard,
  AdminEmpty,
  AdminError,
  AdminPageHeader,
  AdminPagination,
  AdminSearchInput,
  AdminTable,
  AdminTableSkeleton,
  AdminUserAvatar,
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
      setError(
        err instanceof ApiError ? err.message : "Erreur chargement utilisateurs",
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const t = setTimeout(() => void load(), search ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, search]);

  async function handleBan(id: string, name: string) {
    if (!confirm(`Bannir ${name} ? Cette action désactive le compte.`)) return;
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
        description="Recherchez, consultez et modérez les comptes de l'application."
        actions={
          <AdminSearchInput
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Nom ou e-mail…"
          />
        }
      />

      {isLoading && items.length === 0 ? <AdminTableSkeleton rows={8} /> : null}
      {error ? (
        <AdminError message={error} onRetry={() => void load()} />
      ) : null}

      {!isLoading && !error && items.length === 0 ? (
        <AdminCard>
          <AdminEmpty message="Aucun utilisateur ne correspond à votre recherche." />
        </AdminCard>
      ) : null}

      {items.length > 0 ? (
        <AdminCard className={isLoading ? "opacity-60" : undefined}>
          <AdminTable
            headers={["Utilisateur", "E-mail", "Statut", "Matchs", "Reports", ""]}
          >
            {items.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/users/${u.id}`}
                    className="flex items-center gap-3 group"
                  >
                    <AdminUserAvatar
                      name={u.name}
                      avatarUrl={u.profile?.avatarUrl}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-rdv-text group-hover:text-rdv-primary">
                        {u.name}
                      </p>
                      {u.profile?.city ? (
                        <p className="truncate text-xs text-rdv-muted">
                          {u.profile.city}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                  {u.adminRole ? (
                    <div className="mt-1 pl-11">
                      <AdminBadge variant="warning">{u.adminRole}</AdminBadge>
                    </div>
                  ) : null}
                </td>
                <td className="max-w-[200px] truncate px-4 py-3 text-rdv-muted">
                  {u.email}
                </td>
                <td className="px-4 py-3">
                  <AdminBadge
                    variant={u.isActive ? "success" : "danger"}
                    dot
                  >
                    {u.isActive ? "Actif" : "Banni"}
                  </AdminBadge>
                </td>
                <td className="px-4 py-3 tabular-nums">{u.matchCount}</td>
                <td className="px-4 py-3 tabular-nums">{u.reportCount}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {u.isActive ? (
                      <AdminButton
                        variant="ghost"
                        size="sm"
                        onClick={() => void handleBan(u.id, u.name)}
                        className="text-rdv-nope hover:border-rdv-nope/30 hover:bg-rdv-nope-surface"
                      >
                        <Ban className="h-3.5 w-3.5" />
                        Ban
                      </AdminButton>
                    ) : null}
                    <Link
                      href={`/admin/users/${u.id}`}
                      className="flex h-8 w-8 items-center justify-center rounded-[var(--rdv-radius-input)] text-rdv-muted hover:bg-rdv-message hover:text-rdv-primary"
                      aria-label={`Voir ${u.name}`}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
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
