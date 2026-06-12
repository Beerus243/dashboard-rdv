const ADMIN_ACCESS_TOKEN_KEY = "rdv_admin_access_token";
const ADMIN_REFRESH_TOKEN_KEY = "rdv_admin_refresh_token";
const ADMIN_USER_KEY = "rdv_admin_user";

export function getAdminAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ADMIN_ACCESS_TOKEN_KEY);
}

export function getAdminRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ADMIN_REFRESH_TOKEN_KEY);
}

export function getStoredAdminUser<T = unknown>(): T | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(ADMIN_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function persistAdminSession(data: {
  accessToken: string;
  refreshToken?: string;
  user?: unknown;
}) {
  localStorage.setItem(ADMIN_ACCESS_TOKEN_KEY, data.accessToken);
  if (data.refreshToken) {
    localStorage.setItem(ADMIN_REFRESH_TOKEN_KEY, data.refreshToken);
  }
  if (data.user) {
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(data.user));
  }
}

export function clearAdminSession() {
  localStorage.removeItem(ADMIN_ACCESS_TOKEN_KEY);
  localStorage.removeItem(ADMIN_REFRESH_TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
}

export function hasAdminSession(): boolean {
  return Boolean(getAdminAccessToken());
}
