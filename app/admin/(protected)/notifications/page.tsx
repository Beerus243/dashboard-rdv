"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { fetchAdminNotifications, sendAdminNotification } from "@/lib/api/admin";
import type { AdminNotificationItem } from "@/lib/types/admin";
import {
  AdminButton,
  AdminCard,
  AdminEmpty,
  AdminError,
  AdminInput,
  AdminLoading,
  AdminPageHeader,
  AdminPagination,
  AdminTable,
} from "@/components/admin/admin-ui";

export default function AdminNotificationsPage() {
  const [items, setItems] = useState<AdminNotificationItem[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userIds, setUserIds] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchAdminNotifications({ page, limit: 20 });
      setItems(res.data);
      setTotal(res.meta.total);
      setHasMore(res.meta.hasMore);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Erreur notifications");
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    const ids = userIds.split(/[\s,]+/).map((s) => s.trim()).filter(Boolean);
    if (!ids.length || !title.trim()) return;
    setSending(true);
    try {
      await sendAdminNotification({
        userIds: ids,
        title: title.trim(),
        body: body.trim(),
        type: "SYSTEM",
      });
      setUserIds("");
      setTitle("");
      setBody("");
      void load();
      alert("Notification envoyée.");
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Échec envoi");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Notifications"
        description="GET/POST /admin/notifications"
      />

      <AdminCard className="p-4">
        <h2 className="mb-3 text-[13px] font-bold text-rdv-text">
          Envoyer une notification
        </h2>
        <form onSubmit={handleSend} className="grid gap-3 sm:grid-cols-2">
          <AdminInput
            value={userIds}
            onChange={(e) => setUserIds(e.target.value)}
            placeholder="IDs utilisateurs (séparés par virgule)"
            className="sm:col-span-2"
            required
          />
          <AdminInput
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre"
            required
          />
          <AdminInput
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Message"
          />
          <AdminButton type="submit" disabled={sending}>
            {sending ? "Envoi…" : "Envoyer"}
          </AdminButton>
        </form>
      </AdminCard>

      {isLoading && items.length === 0 ? <AdminLoading /> : null}
      {error ? <AdminError message={error} /> : null}
      {!isLoading && !error && items.length === 0 ? (
        <AdminEmpty message="Aucune notification admin." />
      ) : null}
      {items.length > 0 ? (
        <AdminCard>
          <AdminTable headers={["Utilisateur", "Titre", "Type", "Date"]}>
            {items.map((n) => (
              <tr key={n.id}>
                <td className="px-4 py-3">{n.user?.name ?? n.user?.email ?? "—"}</td>
                <td className="px-4 py-3">{n.title}</td>
                <td className="px-4 py-3">{n.type}</td>
                <td className="px-4 py-3 text-xs">
                  {new Date(n.createdAt).toLocaleString("fr-FR")}
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
