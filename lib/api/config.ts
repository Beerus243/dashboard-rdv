export function normalizeBaseUrl(raw: string): string {
  let url = raw.trim();
  while (url.endsWith("/")) {
    url = url.slice(0, -1);
  }
  if (url.endsWith("/api")) {
    url = url.slice(0, -4);
  }
  return url;
}

export const API_BASE_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_API_URL ?? "https://backendrdv-jf71.onrender.com",
);

export function resolveImageUrl(rawPath: string): string {
  const value = rawPath.trim();
  if (!value) return value;
  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("/")
  ) {
    return value;
  }
  return `${API_BASE_URL}/${value.replace(/^\//, "")}`;
}

export const ApiPaths = {
  health: "/health",
  feed: "/feed",
  swipes: "/swipes",
  swipeMatches: "/swipes/matches",
  matchesLikes: "/matches/likes",
  chatConversations: "/chat/conversations",
  notifications: "/notifications",
  profile: "/profile",
  profileFormUpdate: "/profile/form/update",
  exploreCatalog: "/explore/catalog",
  cities: "/cities",
  authLogin: "/auth/login",
  authRegister: "/auth/register",
  authMe: "/auth/me",
  authLoginForm: "/auth/form/login",
  authRegisterForm: "/auth/form/register",
  photos: "/photos",
} as const;
