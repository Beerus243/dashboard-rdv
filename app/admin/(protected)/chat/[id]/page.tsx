"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { fetchAdminConversationMessages } from "@/lib/api/admin";
import type { AdminChatMessage } from "@/lib/types/admin";
import {
  AdminCard,
  AdminEmpty,
  AdminError,
  AdminLoading,
  AdminPageHeader,
  AdminTable,
} from "@/components/admin/admin-ui";

export default function AdminChatDetailPage() {
  const params = useParams<{ id: string }>();
  const [messages, setMessages] = useState<AdminChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchAdminConversationMessages(params.id, { limit: 50 });
        setMessages(res.data);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Conversation introuvable");
      } finally {
        setIsLoading(false);
      }
    }
    void load();
  }, [params.id]);

  if (isLoading) return <AdminLoading />;
  if (error) return <AdminError message={error} />;

  return (
    <div>
      <AdminPageHeader
        title="Conversation"
        description={`GET /admin/chat/conversations/${params.id}`}
      />
      {messages.length === 0 ? (
        <AdminEmpty message="Aucun message." />
      ) : (
        <AdminCard>
          <AdminTable headers={["Expéditeur", "Message", "Date"]}>
            {messages.map((m) => (
              <tr key={m.id}>
                <td className="px-4 py-3">{m.sender?.name ?? "—"}</td>
                <td className="px-4 py-3">{m.content}</td>
                <td className="px-4 py-3 text-xs">
                  {new Date(m.createdAt).toLocaleString("fr-FR")}
                </td>
              </tr>
            ))}
          </AdminTable>
        </AdminCard>
      )}
    </div>
  );
}
