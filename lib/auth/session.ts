const ACCESS_TOKEN_KEY = "rdv_access_token";
const REFRESH_TOKEN_KEY = "rdv_refresh_token";
const USER_KEY = "rdv_user";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getStoredUser<T = unknown>(): T | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function persistSession(data: {
  accessToken: string;
  refreshToken?: string;
  user?: unknown;
}) {
  localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
  if (data.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
  }
  if (data.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }
}

export function clearSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function hasSession(): boolean {
  return Boolean(getAccessToken());
}
