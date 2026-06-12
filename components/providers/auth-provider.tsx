"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { fetchMe, login as apiLogin } from "@/lib/api/auth";
import {
  clearSession,
  getAccessToken,
  getStoredUser,
  hasSession,
  persistSession,
} from "@/lib/auth/session";
import type { AuthUser, LoginResponse } from "@/lib/types";

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  setSession: (data: LoginResponse) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      return;
    }
    const me = await fetchMe(token);
    setUser(me);
    persistSession({ accessToken: token, user: me });
  }, []);

  useEffect(() => {
    async function bootstrap() {
      if (!hasSession()) {
        setIsLoading(false);
        return;
      }
      const cached = getStoredUser<AuthUser>();
      if (cached) setUser(cached);
      try {
        await refreshUser();
      } catch {
        clearSession();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    void bootstrap();
  }, [refreshUser]);

  const setSession = useCallback((data: LoginResponse) => {
    persistSession({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: data.user,
    });
    setUser(data.user);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await apiLogin(email, password);
      setSession(data);
    },
    [setSession],
  );

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user && getAccessToken()),
      login,
      setSession,
      logout,
      refreshUser,
    }),
    [user, isLoading, login, setSession, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
