"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { adminLogin as apiAdminLogin, adminMe } from "@/lib/api/admin";
import {
  clearAdminSession,
  getAdminAccessToken,
  getStoredAdminUser,
  hasAdminSession,
  persistAdminSession,
} from "@/lib/auth/admin-session";
import type { AdminLoginResponse, AdminUser } from "@/lib/types/admin";

type AdminAuthContextValue = {
  admin: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAdmin: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAdmin = useCallback(async () => {
    const token = getAdminAccessToken();
    if (!token) {
      setAdmin(null);
      return;
    }
    const me = await adminMe(token);
    setAdmin(me);
    persistAdminSession({ accessToken: token, user: me });
  }, []);

  useEffect(() => {
    async function bootstrap() {
      if (!hasAdminSession()) {
        setIsLoading(false);
        return;
      }
      const cached = getStoredAdminUser<AdminUser>();
      if (cached) setAdmin(cached);
      try {
        await refreshAdmin();
      } catch {
        clearAdminSession();
        setAdmin(null);
      } finally {
        setIsLoading(false);
      }
    }
    void bootstrap();
  }, [refreshAdmin]);

  const login = useCallback(async (email: string, password: string) => {
    const data: AdminLoginResponse = await apiAdminLogin(email, password);
    persistAdminSession({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: data.user,
    });
    setAdmin(data.user);
  }, []);

  const logout = useCallback(() => {
    clearAdminSession();
    setAdmin(null);
  }, []);

  const value = useMemo(
    () => ({
      admin,
      isLoading,
      isAuthenticated: Boolean(admin && getAdminAccessToken()),
      login,
      logout,
      refreshAdmin,
    }),
    [admin, isLoading, login, logout, refreshAdmin],
  );

  return (
    <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
