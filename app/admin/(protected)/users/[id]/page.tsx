"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { fetchAdminUser } from "@/lib/api/admin";
import {
  AdminCard,
  AdminError,
  AdminLoading,
  AdminPageHeader,
} from "@/components/admin/admin-ui";

export default function AdminUserDetailPage() {
  const params = useParams<{ id: string }>();
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAdminUser(params.id);
        setUser(data);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Utilisateur introuvable");
      }
    }
    void load();
  }, [params.id]);

  if (!user && !error) return <AdminLoading />;
  if (error) return <AdminError message={error} />;

  return (
    <div>
      <AdminPageHeader
        title={String(user?.name ?? "Utilisateur")}
        description={`GET /admin/users/${params.id}`}
      />
      <AdminCard className="p-4">
        <pre className="overflow-x-auto text-xs text-rdv-text">
          {JSON.stringify(user, null, 2)}
        </pre>
      </AdminCard>
    </div>
  );
}
