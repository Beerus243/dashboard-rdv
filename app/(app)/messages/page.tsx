"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { fetchConversations } from "@/lib/api/profile";
import { resolveImageUrl } from "@/lib/api/config";
import type { MessageThread } from "@/lib/types";
import {
  AppCard,
  AppScreenAppBar,
  EmptyState,
  LoadingState,
} from "@/components/ui/app-primitives";

function formatTime(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MessagesPage() {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchConversations();
        setThreads(data);
      } catch (err) {
        setError(
          err instanceof ApiError
            ? err.message
            : "Messagerie indisponible sur ce serveur.",
        );
      } finally {
        setIsLoading(false);
      }
    }
    void load();
  }, []);

  return (
    <>
      <AppScreenAppBar title="Messages" />
      <div className="px-4 py-2">
        {isLoading ? <LoadingState /> : null}
        {!isLoading && error ? (
          <EmptyState title="Conversations" description={error} />
        ) : null}

        {!isLoading && !error && threads.length === 0 ? (
          <EmptyState
            title="Aucune conversation"
            description="Quand tu matcheras, tes discussions apparaîtront ici."
          />
        ) : null}

        {!isLoading && !error && threads.length > 0 ? (
          <div className="space-y-2">
            {threads.map((thread) => (
              <Link
                key={thread.id}
                href={`/messages/${thread.conversationId ?? thread.id}`}
              >
                <AppCard className="flex items-center gap-3 p-3 transition hover:border-rdv-primary/30">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-rdv-primary/15">
                    {thread.avatarUrl ? (
                      <Image
                        src={resolveImageUrl(thread.avatarUrl)}
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="flex h-full items-center justify-center text-lg font-bold text-rdv-primary">
                        {thread.otherUserName.charAt(0)}
                      </span>
                    )}
                    {thread.isOnline ? (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-rdv-surface bg-rdv-like" />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate font-bold text-rdv-text">
                        {thread.otherUserName}
                      </p>
                      <span className="shrink-0 text-xs text-rdv-muted">
                        {formatTime(thread.lastMessageAt)}
                      </span>
                    </div>
                    <p className="truncate text-sm text-rdv-muted">
                      {thread.lastMessage ?? "Démarrer la conversation"}
                    </p>
                  </div>
                  {(thread.unreadCount ?? 0) > 0 ? (
                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-rdv-primary px-1.5 text-xs font-bold text-white">
                      {thread.unreadCount}
                    </span>
                  ) : null}
                </AppCard>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
}
