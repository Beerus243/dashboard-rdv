import { apiRequest } from "./client";
import { AdminPaths } from "./admin-paths";
import { getAdminAccessToken } from "../auth/admin-session";
import type {
  AdminAuditLog,
  AdminChatMessage,
  AdminConversation,
  AdminHealth,
  AdminLoginResponse,
  AdminMatch,
  AdminModerationMessage,
  AdminModerationPhoto,
  AdminNotificationItem,
  AdminReport,
  AdminUser,
  AdminUserListItem,
  AdminUsersStats,
  NotificationType,
  PaginatedResponse,
  PhotoModerationStatus,
  ReportStatus,
  StatAgeGroup,
  StatGender,
  StatGeography,
  StatRevenue,
  UpdateAdminUserBody,
} from "../types/admin";

type QueryParams = Record<string, string | number | boolean | undefined | null>;

function buildQuery(params?: QueryParams): string {
  if (!params) return "";
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  }
  const q = search.toString();
  return q ? `?${q}` : "";
}

function adminFetch<T>(
  path: string,
  options: Parameters<typeof apiRequest<T>>[1] = {},
) {
  return apiRequest<T>(path, {
    ...options,
    token: options.token ?? getAdminAccessToken(),
  });
}

// — Auth —

export async function adminLogin(
  email: string,
  password: string,
): Promise<AdminLoginResponse> {
  return apiRequest<AdminLoginResponse>(AdminPaths.authLogin, {
    method: "POST",
    body: { email, password },
  });
}

export async function adminBootstrap(
  email: string,
  secret: string,
  adminRole = "SUPER_ADMIN",
) {
  return apiRequest<{ message: string; user: AdminUser }>(
    AdminPaths.authBootstrap,
    { method: "POST", body: { email, secret, adminRole } },
  );
}

export async function adminMe(token?: string | null) {
  return adminFetch<AdminUser>(AdminPaths.authMe, { token });
}

// — Users —

export async function fetchAdminUsers(params?: QueryParams) {
  return adminFetch<PaginatedResponse<AdminUserListItem>>(
    `${AdminPaths.users}${buildQuery(params)}`,
  );
}

export async function fetchAdminUser(id: string) {
  return adminFetch<Record<string, unknown>>(AdminPaths.user(id));
}

export async function updateAdminUser(id: string, body: UpdateAdminUserBody) {
  return adminFetch(AdminPaths.user(id), { method: "PUT", body });
}

export async function banAdminUser(id: string) {
  return adminFetch(AdminPaths.user(id), { method: "DELETE" });
}

// — Reports —

export async function fetchAdminReports(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: ReportStatus;
}) {
  return adminFetch<PaginatedResponse<AdminReport>>(
    `${AdminPaths.reports}${buildQuery(params)}`,
  );
}

export async function fetchAdminReport(id: string) {
  return adminFetch<AdminReport>(AdminPaths.report(id));
}

export async function closeAdminReport(id: string, resolution?: string) {
  return adminFetch(AdminPaths.reportClose(id), {
    method: "POST",
    body: { resolution },
  });
}

// — Moderation —

export async function fetchModerationPhotos(params?: {
  page?: number;
  limit?: number;
  status?: PhotoModerationStatus;
}) {
  return adminFetch<PaginatedResponse<AdminModerationPhoto>>(
    `${AdminPaths.moderationPhotos}${buildQuery(params)}`,
  );
}

export async function moderatePhoto(
  id: string,
  action: "approve" | "reject",
  reason?: string,
) {
  return adminFetch(AdminPaths.moderationPhoto(id), {
    method: "POST",
    body: { action, reason },
  });
}

export async function fetchModerationMessages(params?: QueryParams) {
  return adminFetch<PaginatedResponse<AdminModerationMessage>>(
    `${AdminPaths.moderationMessages}${buildQuery(params)}`,
  );
}

// — Matches & chat —

export async function fetchAdminMatches(params?: QueryParams) {
  return adminFetch<PaginatedResponse<AdminMatch>>(
    `${AdminPaths.matches}${buildQuery(params)}`,
  );
}

export async function fetchAdminConversations(params?: QueryParams) {
  return adminFetch<PaginatedResponse<AdminConversation>>(
    `${AdminPaths.chatConversations}${buildQuery(params)}`,
  );
}

export async function fetchAdminConversationMessages(
  id: string,
  params?: QueryParams,
) {
  return adminFetch<PaginatedResponse<AdminChatMessage>>(
    `${AdminPaths.chatConversation(id)}${buildQuery(params)}`,
  );
}

// — Notifications —

export async function fetchAdminNotifications(params?: {
  page?: number;
  limit?: number;
  search?: string;
  type?: NotificationType;
  userId?: string;
}) {
  return adminFetch<PaginatedResponse<AdminNotificationItem>>(
    `${AdminPaths.notifications}${buildQuery(params)}`,
  );
}

export async function sendAdminNotification(body: {
  userIds: string[];
  title: string;
  body: string;
  type?: NotificationType;
}) {
  return adminFetch(AdminPaths.notifications, { method: "POST", body });
}

// — Stats —

export async function fetchAdminUsersStats() {
  return adminFetch<AdminUsersStats>(AdminPaths.statsUsers);
}

export async function fetchAdminGenderStats() {
  return adminFetch<StatGender[]>(AdminPaths.statsGender);
}

export async function fetchAdminAgeGroupStats() {
  return adminFetch<StatAgeGroup[]>(AdminPaths.statsAgeGroups);
}

export async function fetchAdminGeographyStats() {
  return adminFetch<StatGeography[]>(AdminPaths.statsGeography);
}

export async function fetchAdminRevenueStats() {
  return adminFetch<StatRevenue>(AdminPaths.statsRevenue);
}

// — Infra & audit —

export async function fetchAdminHealth() {
  return adminFetch<AdminHealth>(AdminPaths.health);
}

export async function fetchAdminAuditLogs(params?: QueryParams) {
  return adminFetch<PaginatedResponse<AdminAuditLog>>(
    `${AdminPaths.auditLogs}${buildQuery(params)}`,
  );
}
