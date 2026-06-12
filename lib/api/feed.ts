import { apiRequest } from "./client";
import { ApiPaths } from "./config";
import { getAccessToken } from "../auth/session";
import type { FeedProfile } from "../types";

export type FeedParams = {
  page?: number;
  limit?: number;
  city?: string;
  minAge?: number;
  maxAge?: number;
  distance?: number;
  gender?: string;
  interestedIn?: string;
};

export async function fetchFeed(params: FeedParams = {}): Promise<FeedProfile[]> {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      search.set(key, String(value));
    }
  });
  const query = search.toString();
  return apiRequest<FeedProfile[]>(
    `${ApiPaths.feed}${query ? `?${query}` : ""}`,
    { token: getAccessToken() },
  );
}

export async function swipe(
  toUserId: string,
  liked: boolean,
): Promise<{ match: boolean; matchId?: string }> {
  return apiRequest(ApiPaths.swipes, {
    method: "POST",
    token: getAccessToken(),
    body: { toUserId, liked },
  });
}

export async function fetchMatches() {
  return apiRequest(ApiPaths.swipeMatches, { token: getAccessToken() });
}

export async function fetchReceivedLikes(page = 1, limit = 20) {
  return apiRequest<{
    items: import("../types").LikePreview[];
    total: number;
    page: number;
    hasMore: boolean;
  }>(`${ApiPaths.matchesLikes}?page=${page}&limit=${limit}`, {
    token: getAccessToken(),
  });
}
