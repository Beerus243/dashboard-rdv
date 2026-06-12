import { apiRequest } from "./client";
import { ApiPaths } from "./config";
import { getAccessToken } from "../auth/session";
import type { MessageThread, UserProfile } from "../types";

export async function fetchProfile(): Promise<UserProfile> {
  return apiRequest<UserProfile>(ApiPaths.profile, {
    token: getAccessToken(),
  });
}

export async function updateProfile(body: Partial<UserProfile>) {
  return apiRequest<UserProfile>(ApiPaths.profile, {
    method: "PUT",
    token: getAccessToken(),
    body,
  });
}

export async function fetchConversations(): Promise<MessageThread[]> {
  const data = await apiRequest<unknown>(ApiPaths.chatConversations, {
    token: getAccessToken(),
  });
  if (Array.isArray(data)) return data as MessageThread[];
  if (data && typeof data === "object" && "items" in data) {
    return (data as { items: MessageThread[] }).items;
  }
  return [];
}

export async function fetchExploreCatalog() {
  return apiRequest<import("../types").ExploreInterest[]>(
    ApiPaths.exploreCatalog,
    { token: getAccessToken() },
  );
}

export async function fetchUnreadNotificationCount(): Promise<number> {
  try {
    const data = await apiRequest<{ count?: number; unread?: number }>(
      `${ApiPaths.notifications}?unreadOnly=true&limit=1`,
      { token: getAccessToken() },
    );
    return data.count ?? data.unread ?? 0;
  } catch {
    return 0;
  }
}
