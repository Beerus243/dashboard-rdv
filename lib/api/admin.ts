import { apiRequest } from "./client";
import { getAdminAccessToken } from "../auth/admin-session";
import type {
  AdminLoginResponse,
  AdminUser,
  AdminUsersStats,
} from "../types/admin";

export async function adminLogin(
  email: string,
  password: string,
): Promise<AdminLoginResponse> {
  return apiRequest<AdminLoginResponse>("/admin/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export async function adminBootstrap(
  email: string,
  secret: string,
): Promise<{ message: string; user: AdminUser }> {
  return apiRequest("/admin/auth/bootstrap", {
    method: "POST",
    body: { email, secret, adminRole: "SUPER_ADMIN" },
  });
}

export async function adminMe(token?: string | null): Promise<AdminUser> {
  return apiRequest<AdminUser>("/admin/auth/me", {
    token: token ?? getAdminAccessToken(),
  });
}

export async function fetchAdminUsersStats(): Promise<AdminUsersStats> {
  return apiRequest<AdminUsersStats>("/admin/stats/users", {
    token: getAdminAccessToken(),
  });
}

export async function fetchAdminHealth() {
  return apiRequest<{
    status: string;
    timestamp: string;
    services?: Record<string, string>;
  }>("/admin/health", {
    token: getAdminAccessToken(),
  });
}
