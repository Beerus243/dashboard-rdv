"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { fetchAdminUser } from "@/lib/api/admin";
import {
  AdminBadge,
  AdminCard,
  AdminError,
  AdminLoading,
  AdminPageHeader,
  AdminSkeleton,
  AdminUserAvatar,
} from "@/components/admin/admin-ui";

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex flex-col gap-0.5 border-b border-rdv-divider py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-rdv-muted">{label}</span>
      <span className="text-sm font-semibold text-rdv-text">{value}</span>
    </div>
  );
}

export default function AdminUserDetailPage() {
  const params = useParams<{ id: string }>();
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showRaw, setShowRaw] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAdminUser(params.id);
        setUser(data);
      } catch (err) {
        setError(
          err instanceof ApiError ? err.message : "Utilisateur introuvable",
        );
      }
    }
    void load();
  }, [params.id]);

  if (!user && !error) {
    return (
      <div className="space-y-4">
        <AdminSkeleton className="h-8 w-48" />
        <AdminSkeleton className="h-40 w-full" />
      </div>
    );
  }

  if (error) return <AdminError message={error} />;

  const profile = user?.profile as Record<string, unknown> | undefined;
  const name = String(user?.name ?? "Utilisateur");
  const email = String(user?.email ?? "");
  const isActive = user?.isActive !== false;

  return (
    <div>
      <AdminPageHeader
        title={name}
        description={email}
        backHref="/admin/users"
        actions={
          <AdminBadge variant={isActive ? "success" : "danger"} dot>
            {isActive ? "Actif" : "Banni"}
          </AdminBadge>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <AdminCard className="p-5 lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <AdminUserAvatar
              name={name}
              avatarUrl={profile?.avatarUrl as string | undefined}
              size="lg"
            />
            <h2 className="mt-4 text-lg font-extrabold">{name}</h2>
            <p className="text-sm text-rdv-muted">{email}</p>
            {user?.adminRole ? (
              <div className="mt-3">
                <AdminBadge variant="warning">
                  {String(user.adminRole)}
                </AdminBadge>
              </div>
            ) : null}
          </div>
        </AdminCard>

        <AdminCard className="p-5 lg:col-span-2">
          <h3 className="mb-2 text-sm font-bold text-rdv-text">Informations</h3>
          <InfoRow label="Ville" value={profile?.city as string} />
          <InfoRow label="Genre" value={profile?.gender as string} />
          <InfoRow
            label="Profil complet"
            value={profile?.isComplete ? "Oui" : "Non"}
          />
          <InfoRow
            label="Inscription"
            value={
              user?.createdAt
                ? new Date(String(user.createdAt)).toLocaleString("fr-FR")
                : null
            }
          />
          <InfoRow
            label="Dernière activité"
            value={
              profile?.lastActiveAt
                ? new Date(String(profile.lastActiveAt)).toLocaleString("fr-FR")
                : null
            }
          />
          {user?.banReason ? (
            <InfoRow label="Motif du ban" value={String(user.banReason)} />
          ) : null}
        </AdminCard>
      </div>

      <AdminCard className="mt-4 p-4">
        <button
          type="button"
          onClick={() => setShowRaw((v) => !v)}
          className="text-sm font-semibold text-rdv-primary hover:underline"
        >
          {showRaw ? "Masquer" : "Afficher"} les données brutes JSON
        </button>
        {showRaw ? (
          <pre className="mt-3 max-h-96 overflow-auto rounded-[var(--rdv-radius-input)] bg-rdv-bg p-4 text-xs text-rdv-text">
            {JSON.stringify(user, null, 2)}
          </pre>
        ) : null}
      </AdminCard>

      <p className="mt-4 text-center text-sm">
        <Link href="/admin/users" className="font-semibold text-rdv-primary hover:underline">
          ← Retour à la liste
        </Link>
      </p>
    </div>
  );
}
